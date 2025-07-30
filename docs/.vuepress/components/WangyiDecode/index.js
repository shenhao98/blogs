import CryptoJS from 'crypto-js';
/**
 * NCM文件解密函数
 * @param {File} file - 上传的NCM文件
 * @returns {Promise<Object>} 解密结果（包含音频URL、歌曲信息等）
 */
export async function decryptNCM(file) {
  // 1. 读取文件内容为ArrayBuffer
  const arrayBuffer = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsArrayBuffer(file);
  });
  const dataView = new DataView(arrayBuffer);

  // 2. 验证文件合法性（NCM文件头标识）
  const header1 = dataView.getUint32(0, true); // 小端模式读取
  const header2 = dataView.getUint32(4, true);
  if (header1 !== 1313166403 || header2 !== 1296122950) {
    return { status: false, message: "此NCM文件已损坏" };
  }

  // 3. 解密密钥与核心数据
  let offset = 10; // 跳过文件头
  // 3.1 解密密钥区块（AES-ECB）
  const keyLength = dataView.getUint32(offset, true);
  offset += 4;
  // 提取加密的密钥数据并异或处理（100^每个字节）
  const encryptedKey = new Uint8Array(arrayBuffer, offset, keyLength)
    .map(byte => byte ^ 100);
  offset += keyLength;
  // AES解密密钥（固定密钥）
  const aesKey = CryptoJS.enc.Hex.parse("687a4852416d736f356b496e62617857");
  const decryptedKey = CryptoJS.AES.decrypt(
    { ciphertext: CryptoJS.lib.WordArray.create(encryptedKey) },
    aesKey,
    { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }
  );
  // 提取实际密钥（去除前17字节冗余）
  const realKey = new Uint8Array(decryptedKey.sigBytes);
  for (let i = 0; i < decryptedKey.sigBytes; i++) {
    realKey[i] = (decryptedKey.words[i >> 2] >>> (24 - (i % 4) * 8)) & 255;
  }
  const key = realKey.slice(17);

  // 3.2 生成解密掩码（用于音频数据解密）
  const mask = generateMask(key);

  // 3.3 解密元数据（歌曲信息）
  const metaLength = dataView.getUint32(offset, true);
  offset += 4;
  let meta = {}
  if (metaLength > 0) {
    // 提取加密的元数据并异或处理（99^每个字节）
    const encryptedMeta = new Uint8Array(arrayBuffer, offset, metaLength)
      .map(byte => byte ^ 99);
    offset += metaLength;
    // 解密元数据（AES-ECB，固定密钥）
    const metaKey = CryptoJS.enc.Hex.parse("2331346C6A6B5F215C5D2630553C2728");
    const decryptedMeta = CryptoJS.AES.decrypt(
      { ciphertext: CryptoJS.enc.Base64.parse(
        CryptoJS.lib.WordArray.create(encryptedMeta.slice(22)).toString(CryptoJS.enc.Utf8)
      )},
      metaKey,
      { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }
    );
    // 解析为JSON（去除前6字节冗余）
    const metaStr = decryptedMeta.toString(CryptoJS.enc.Utf8).slice(6);
    meta = JSON.parse(metaStr);
    // 修复封面图片URL为HTTPS
    meta.albumPic = meta.albumPic.replace("http:", "https:");
  }

  // 3.4 解密音频数据（核心）
  // 跳过冗余字节
  const audioStartOffset = offset + dataView.getUint32(offset + 5, true) + 13;
  const audioData = new Uint8Array(arrayBuffer, audioStartOffset);
  // 应用掩码解密（每个字节与掩码异或）
  for (let i = 0; i < audioData.length; i++) {
    audioData[i] ^= mask[255 & i]; // 掩码循环使用
  }

  // 4. 生成可播放的音频文件
  const format = detectFormat(audioData); // 判断是MP3还是FLAC
  const mimeType = format === "flac" ? "audio/flac" : "audio/mpeg";
  const blob = new Blob([audioData], { type: mimeType });
  const audioUrl = URL.createObjectURL(blob);

  // 5. 返回结果
  return {
    status: true,
    filename: `${meta.artist.join(" & ")} - ${meta.musicName}.${format}`,
    title: meta.musicName,
    artist: meta.artist.join(" & "),
    album: meta.album,
    picture: meta.albumPic,
    file: audioUrl,
    mime: mimeType
  };
}

/**
 * 生成解密掩码（基于密钥的伪随机序列）
 * @param {Uint8Array} key - 解密密钥
 * @returns {Uint8Array} 掩码数组
 */
function generateMask(key) {
  const mask = new Uint8Array(256);
  // 初始化掩码为0-255
  for (let i = 0; i < 256; i++) mask[i] = i;
  let j = 0;
  // 用密钥打乱掩码（类似RC4算法）
  for (let i = 0; i < 256; i++) {
    j = (j + mask[i] + key[i % key.length]) & 255;
    [mask[i], mask[j]] = [mask[j], mask[i]]; // 交换
  }
  // 生成最终掩码序列
  return mask.map((_, i) => {
    const t = (i + 1) & 255;
    const a = mask[t];
    const b = mask[(t + a) & 255];
    return mask[(a + b) & 255];
  });
}

/**
 * 判断音频格式（FLAC或MP3）
 * @param {Uint8Array} data - 音频数据
 * @returns {string} 格式标识（"flac"或"mp3"）
 */
function detectFormat(data) {
  // FLAC文件头标识：102, 76, 97, 67（对应"fLaC"）
  if (data.length >= 4 &&
      data[0] === 102 && data[1] === 76 &&
      data[2] === 97 && data[3] === 67) {
    return "flac";
  }
  // 否则默认为MP3
  return "mp3";
}