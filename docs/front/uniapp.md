---
title: uniapp
---

## 判断应用是否连接到服务器
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