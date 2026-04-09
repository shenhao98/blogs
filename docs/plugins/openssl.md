### 第一步：生成自签名证书

现代浏览器（Chrome 等）强制要求证书必须包含 SAN 字段，否则即使生成了证书也会报错。我们需要通过一个配置文件来实现。

#### 1. 创建配置文件 `san.cnf`

在当前目录下新建一个文件 `san.cnf`，内容如下（注意修改 `DNS` 和 `IP` 为你需要的地址）：

```ini
[req]
default_bits = 2048
prompt = no
default_md = sha256
distinguished_name = dn
req_extensions = req_ext

[dn]
C = CN
ST = Beijing
L = Beijing
O = MyDev
OU = IT
CN = localhost

[req_ext]
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
DNS.2 = mysite.local
IP.1 = 127.0.0.1
# 如果是局域网访问，建议加上你的局域网 IP
# IP.2 = 192.168.1.100
```

#### 2. 执行 OpenSSL 命令

在终端中运行以下命令，生成私钥 (`.key`) 和证书 (`.crt`)：

```bash
# 1. 生成私钥和 CSR
openssl req -new -newkey rsa:2048 -nodes -keyout server.key -out server.csr -config san.cnf

# 2. 生成自签名证书 (有效期 365 天)
openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt -extensions req_ext -extfile san.cnf
```

执行成功后，你会得到 `server.key` 和 `server.crt` 两个文件。

---

### 第二步：在 Node.js 中使用

你可以使用原生的 `https` 模块或 `Express` 来加载这些文件。

#### 方式 A：使用原生 `https` 模块

创建一个 `server.js`：

```javascript
const https = require('https')
const fs = require('fs')

const options = {
  // 读取刚才生成的证书和私钥
  key: fs.readFileSync('./server.key'),
  cert: fs.readFileSync('./server.crt'),
}

https
  .createServer(options, (req, res) => {
    res.writeHead(200)
    res.end('Hello Secure Node.js!\n')
  })
  .listen(3000, () => {
    console.log('HTTPS Server running on https://localhost:3000')
  })
```

#### 方式 B：使用 Express

如果你使用 Express 框架：

```javascript
const express = require('express')
const https = require('https')
const fs = require('fs')

const app = express()

app.get('/', (req, res) => {
  res.send('Express with HTTPS is working!')
})

const server = https.createServer(
  {
    key: fs.readFileSync('./server.key'),
    cert: fs.readFileSync('./server.crt'),
  },
  app,
)

server.listen(3000, () => {
  console.log('Express HTTPS server listening on port 3000')
})
```

---

### 第三步：解决浏览器“不安全”警告

由于是自签名证书，直接访问 `https://localhost:3000` 时，浏览器会拦截并提示“连接不安全”。

**解决方法（以 Chrome/Edge 为例）：**

1.  **临时访问**：点击页面左下角的“高级” -> “继续前往 localhost (不安全)”。
2.  **彻底信任（推荐开发用）**：
    - **Windows**: 双击 `server.crt` 文件 -> 安装证书 -> 选择“本地计算机” -> 将证书放入“受信任的根证书颁发机构” -> 完成。
    - **macOS**: 双击 `server.crt` 添加到钥匙串 -> 在钥匙串访问中找到该证书 -> 双击打开 -> “信任” -> 选择“始终信任”。

重启浏览器后，地址栏就会显示安全锁图标了。

### 常见问题排查

如果在启动 Node.js 服务时遇到报错 `ERR_OSSL_X509_KEY_VALUES_MISMATCH`，说明证书和私钥不匹配。
你可以通过以下命令验证它们是否匹配（两个命令输出的 MD5 值应该相同）：

```bash
# 验证证书
openssl x509 -noout -modulus -in server.crt | openssl md5
# 验证私钥
openssl rsa -noout -modulus -in server.key | openssl md5
```

### 启动serve服务

```bash
serve --ssl-cert server.crt --ssl-key server.key
```

## mkcert创建证书

1.安装mkcert

```powershell
winget install mkcert
```

2.创建证书

```bash
mkcert -cert-file server.crt -key-file server.key localhost 127.0.0.1 192.168.1.100
```

3.安装根证书,运行命令找到根证书文件夹,发送rootCA.pem到手机安装，信任：关于手机 -> 底部证书信任设置

```bash
mkcert -CAROOT
```

4.启动serve服务

```bash
serve --ssl-cert server.crt --ssl-key server.key
```
