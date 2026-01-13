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
