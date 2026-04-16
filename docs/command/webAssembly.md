## 外部注入 js 文件

编写注入文件

```js title="pkg.js"
mergeInto(LibraryManager.library, {
  callback: function (ciphertext, cipherlength, angle, px, py, bmp, bmpLength, len) {},
})
```

在 C 代码中使用外部 js

```c title="demo.c"
#include <stdint.h>
#include <emscripten.h>

// 定义小程序接收回调函数
EMSCRIPTEN_KEEPALIVE
extern void callback(const uint8_t* ciphertext, int cipherlength, float angle, float px, float py, const uint8_t* bmp, int bmpLength, size_t len);

EMSCRIPTEN_KEEPALIVE
void Recognize(
    const uint8_t* bmpBuffer,     // BMP图像数据缓冲区
    int bufferLength,             // 缓冲区长度
    int seed,                     // 随机种子
    int maxblockcount) {

    size_t len = sizeof(bmpBuffer);
    // 模拟解密得到的密文
    uint8_t abcdef_chars[] = {'A', 'B', 'C', 'D', 'E', 'F'};
    // ...其它代码
    float angle, px, py;
    angle = 1.23f;
    py = 24.34f;
    px = 3.45f;
    call_alert();
    // 返回结果
    callback(abcdef_chars, bufferLength, angle ,px, py, bmpBuffer, bufferLength, len);
}
```

打包命令

```bash
emcc --no-entry  demo.c --js-library pkg.js -o demo.wasm
```

## 内部注入 js

```c
EM_JS(void, callback, (int a), {});
```

## wasm压缩解压

下载[brotli](https://github.com/google/brotli/releases)

```bash
# 基础压缩（默认压缩级别）
brotli -o your_file.wasm.br your_file.wasm

# 高压缩级别（推荐，压缩率更高，耗时稍长）
brotli -9 -o your_file.wasm.br your_file.wasm
```

```bash
# 基础解压（生成同名 .wasm 文件）
brotli -d your_file.wasm.br

# 自定义输出文件名（避免覆盖已有文件）
brotli -d your_file.wasm.br -o uncompressed.wasm
```

## 转wat文件分析

```bash
# 安装工具
npm i wasm2wat -g

# 编译命令
wasm2wat demo.wasm -o demo.wat
```

## wasm反编译伪代码

[工具下载](https://github.com/WebAssembly/wabt)

```bash
wasm-decompile test.wasm -o test.dcmp
```
