## 1. 判断应用是否连接到服务器

使用`uni_modules`插件

```kotlin
package uts.sdk.modules.testIp
import java.io.BufferedReader
import java.io.InputStreamReader
import java.util.concurrent.TimeUnit
object NativeFile {
  fun isIpReachable(ip: String, callback: (code: Boolean) -> Unit) {
    Thread {
      val process = Runtime.getRuntime().exec(arrayOf("ping", "-c", "1", ip))
      // 等待命令执行完成，并获取退出码
      val isCompleted  = process.waitFor(3, TimeUnit.SECONDS)
      if (isCompleted) {
        val exitCode = process.exitValue()
        if (exitCode == 0) {
          callback(true)
        } else {
          callback(false)
        }
      } else {
        callback(isCompleted)
      }
    }.start()
  }
}
```

## 2. canvas 不生效

使用 setup 函数时,在封装的组件中需要在<code>createCanvasContext()</code>传入<code>getCurrentInstance()</code>代替 this

```javascript
import { getCurrentInstance } from 'vue'
const instance = getCurrentInstance()
const drawContent = () => {
  // ...
  const ctx = uni.createCanvasContext('myCanvas', instance)
  // ...
}
```

## 3. base64 转本地文件

Base64.decode 超级慢

```javascript
base64ToFilePath(base64) {
  plus.io.requestFileSystem(plus.io.PRIVATE_DOC, function (fs) {
    // 可通过fs进行文件操作
    console.log('fs.roo11t1 -->', fs.root.fullPath)
    fs.root.getFile(
      `${Date.now()}.png`,
      { create: true },
      (fileEntry) => {
        var fullPath = fileEntry.fullPath
        console.log('平台绝对路径', fullPath)
        // 引入安卓原生类
        var Base64 = plus.android.importClass('android.util.Base64')
        var FileOutputStream = plus.android.importClass('java.io.FileOutputStream')
        //如果文件不存在则创建文件，如果文件存在则删除文件后重新创建文件
        var out = new FileOutputStream(fullPath)
        /**
         * 此处需要把base64前缀去除，在写入字节流数组
         * 去除头部data:image/jpg;base64,留下base64编码后的字符串
         **/
        //base64解密得到字节流bytes；
        var bytes = Base64.decode(base64, 0)
        try {
          out.write(bytes) // byte 数组写入此文件输出流中。
          out.flush() //刷新写入文件中去。
          out.close() //关闭此文件输出流并释放与此流有关的所有系统资源。
        } catch (e) {
          console.log(e.message)
        }
      },
      (err) => {
        console.log('获取文件失败 -->', err)
      }
    )
  })
}
```

方法二 使用 uni_modules

```kotlin
package uts.sdk.modules.shAndroid
import android.util.Base64
import java.io.File
import java.io.FileOutputStream
import java.io.IOException

/**
 * 将 Base64 字符串转换并写入指定路径的 JPG 文件
 * @param targetPath 目标 JPG 文件完整路径（如：/sdcard/Android/data/com.xxx/files/dd.jpg）
 * @param base64Str 图片 Base64 字符串（可带前缀：data:image/jpeg;base64, 也可不带）
 * @return Boolean 写入成功返回 true，失败返回 false
 */
object NativeUtils {

  fun base64ToJpgFile(targetPath: String, base64Str: String, callback: (Int) -> Unit): Boolean {
      // 1. 参数合法性校验
      if (targetPath.isBlank() || base64Str.isBlank()) {
          callback(0)
          return false
      }

      var pureBase64Str = base64Str
      // 2. 移除 Base64 前缀（若存在），避免解码失败
      if (base64Str.contains(",")) {
          pureBase64Str = base64Str.split(",")[1]
      }

      var imageBytes: ByteArray? = null
      try {
          // 3. Base64 字符串解码为字节数组（Android 原生 API）
          imageBytes = Base64.decode(pureBase64Str, Base64.DEFAULT)
      } catch (e: IllegalArgumentException) {
          // 捕获无效 Base64 字符串异常（编码错误、字符串损坏等）
          e.printStackTrace()
          callback(0)
          return false
      }

      // 4. 创建目标文件及父目录（若不存在则递归创建）
      val targetFile = File(targetPath)
      val parentDir = targetFile.parentFile
      if (parentDir != null && !parentDir.exists()) {
          // 递归创建父目录，确保文件写入路径存在
          val isDirCreated = parentDir.mkdirs()
          if (!isDirCreated) {
              callback(0)
              return false
          }
      }

      // 5. 使用 FileOutputStream 写入字节数组生成 JPG 文件
      FileOutputStream(targetFile).use { fos ->
          // use 语法自动关闭流（Kotlin 内置扩展，等价于 Java try-with-resources）
          try {
              fos.write(imageBytes) // 写入解码后的图片字节数组
              fos.flush() // 强制刷新缓冲区，确保数据全部写入文件
              callback(1) // 写入成功回调`
              return true
          } catch (e: IOException) {
              // 捕获文件写入异常（权限不足、路径无效、文件被占用等）
              e.printStackTrace()
              callback(0)
              return false
          }
      }
  }
}
```

## 4. subNVues

::: danger 恶心的bug

1. 必须保存两次配置才能生效
2. top会给元素自动生成内边距，比如想要top=30px，那么就设置top=15px
   :::

如果两个subNVues,需要把 `style` 的 `background` 设置为 `rgba(0,0,0,0)` 不然层叠不起效果
[配置文档](https://uniapp.dcloud.net.cn/collocation/pages.html#app-subnvues)

```json title="pages.json"
"app-plus": {
  "subNVues": [
    {
      "id": "access_widget",
      "path": "pages/launch/subNvue/index",
      "style": {
        "background": "rgba(0,0,0,0)",
        "zIndex": 188
      }
    },
    {
      "id": "access_widget1",
      "path": "pages/launch/subNvue/index2",
      "style": {
        "background": "rgba(0,0,0,0)",
        "zIndex": 193
      }
    }
  ]
}
```

手动关闭窗体 [开发文档](https://uniapp.dcloud.net.cn/api/window/subNVues.html#subnvue)

```vue
uni.getSubNVueById('access_widget1').hide()
```

::: warning
每次修改之后必须重启
:::

## 5. HelloUniApp

1. `app\src\main\assets\apps`下的文件夹对应APPID
2. `app\src\main\assets\data\dcloud_control.xml` 下的`appid`对应APPID
3. 从 Android云端证书 -> [下载云端证书](https://dev.dcloud.net.cn/pages/app/detail/info?appid=__UNI__XXXX)到 src 目录
4. 项目级别的`build.gradle`配置证书

```gradle title="build.gradle"
// 云端证书页面 点击证书详情
signingConfigs {
    config {
        keyAlias '__uni__cdeffui'  // 证书详情的别名
        keyPassword '124' // 点击查看证书密码获得
        storeFile file('app.keystore') // 从云端证书下载下来的文件重命名后
        storePassword '124' // 点击查看证书密码获得
        v1SigningEnabled true // 不用动
        v2SigningEnabled true // 不用动
    }
}
```

5. 配置包名 build.gradle 中的 applicationId 包名和各平台信息 `包名/appid/域名` 一致
6. 配置appKey 各平台信息 -> 查看离线key 里面的 `Android` 字段
