## gradle 无法下载

更换镜像地址 mirrors.cloud.tencent.com/gradle
如果还无法下载就把<code>bin.zip</code> 改为<code>all.zip</code>

```gradle-wrapper.properties
distributionUrl=https\://mirrors.cloud.tencent.com/gradle/gradle-8.13-all.zip
```

## ndk查看so导出函数

使用 Android NDK 自带的 llvm-nm

```
 <!--ndk path -->
D:\tool\AndroidSDK\ndk\29.0.14206865\toolchains\llvm\prebuilt\windows-x86_64\bin
```

```cmd
llvm-nm.exe -D "target.so" | findstr "Java_"
```

NDK打包so文件 android项目根目录运行

```cmd
<!-- 正式版 -->
./gradlew assembleRelease
<!-- 测试版 -->
./gradlew assembleDebug
```

## 打包aar给uniapp

### 1. 新建模块

首先要下载UniPlugin-Hello-AS

1. 打开新建模块界面 部菜单 → File → New → New Module…

2. 把当前模块的`build.gradle.kts` 的plugins改为 `alias(libs.plugins.android.library)`，注释掉defaultConfig中的`applicationId、versionCode、versionName`

```kts title="build.gradle.kts"
plugins {
  // 加上
  alias(libs.plugins.android.library)
}

defaultConfig {
  // 把下面这几个注释了
  // applicationId = "cn.mga1.facedetectionlib"
  minSdk = 24
  targetSdk = 36
  // versionCode = 1
  // versionName = "1.0"

    testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
}

```

3. 修改`libs.versions.toml`

```toml title="libs.versions.toml"
[plugins]
// 加上下面这行
android-library = { id = "com.android.library", version.ref = "agp" }
```

4. Gradle → 你的lib模块 → Tasks → build → assembleRelease

5. 最后在`module\build\outputs\aar`下找到打包好的aar文件

### 2.在AS中使用模块

下面方式可以引入libs下的所有`.arr`结尾文件，点击`asyn`

```kts title="build.gradle.kts"
dependencies {
  implementation(fileTree(mapOf("dir" to "src/libs", "include" to listOf("*.aar"))))
}
```

### 3.插件配置

1. 创建一个libs文件夹，将aar文件放入libs文件夹中
2. 配置`config.json`

```json title="config.json"
// .aar是自动引入不需要配置
{
  "minSdkVersion": "21",
  // 云打包不提供这些依赖 需要手动引入
  "dependencies": [
    "androidx.activity:activity-compose:1.8.0",
    "androidx.compose.material3:material3:1.3.1",
    "androidx.compose.ui:ui:1.7.5",
    "androidx.compose.ui:ui-graphics:1.7.5",
    "androidx.compose.ui:ui-tooling-preview:1.7.5",
    "androidx.lifecycle:lifecycle-runtime-ktx:2.6.1"
  ]
}
```

3. 跳转activity

```ts
export function toTestPage() {
  const activity = UTSAndroid.getUniActivity()!
  const ComposeFaceActivity = java.lang.Class.forName('cn.mga1.uts_face.FaceDetectionActivity')
  const intent = new Intent(activity, ComposeFaceActivity)
  activity.startActivityForResult(intent, 1000)
}

// 或者调用kotlin跳转
import TestModule from 'uts.sdk.modules.shFace.TestModule2'
export function toTestPage2() {
  const activity = UTSAndroid.getUniActivity()!
  new TestModule().gotoNativePage2(activity)
}

// 全局监听返回
UTSAndroid.onAppActivityResult((requestCode: Int, resultCode: Int, data?: Intent) => {
  if (requestCode == REQUEST_CODE) {
    // 我们发起的请求
    let eventName =
      'onAppActivityResult  -  requestCode:' +
      requestCode +
      ' -resultCode:' +
      resultCode +
      ' -data:' +
      JSON.stringify(data)
    console.log(eventName)
  } else {
    // 别的代码发起的请求，不要处理
  }
})
```

```kt
// kotlin跳转
import io.dcloud.feature.uniapp.common.UniModule
class TestModule2 :UniModule() {

  var REQUEST_CODE: Int = 1000
  val TAG = "TestModule"

  @UniJSMethod(uiThread = true)
  fun gotoNativePage2(context: Context) {
      Log.d(TAG, "gotoNativePage: eqweqweqw")
      val intent: Intent =
          Intent(context, FaceDetectionActivity::class.java)
      (context as Activity).startActivityForResult(
          intent,
          REQUEST_CODE
      )
  }
}
```

```kt
// as中测试跳转
@UniJSMethod(uiThread = true)
fun gotoNativePage() {
    Log.d(TAG, "gotoNativePage: yriuew4324324234234234yruwyer")

    if (mUniSDKInstance != null) {
        val intent: Intent =
            Intent(mUniSDKInstance.getContext(), FaceDetectionActivity::class.java)
        (mUniSDKInstance.getContext() as Activity).startActivityForResult(
            intent,
              REQUEST_CODE
        )
    }
}
```

## 开发一个组件

创建好library后只需要改这些

```kts title="build.gradle"
plugins {
  id 'org.jetbrains.kotlin.plugin.compose'
}
android {
  buildFeatures {
    compose true
  }
  // 这个不确定加不加
  composeOptions {
    kotlinCompilerExtensionVersion = "1.5.4"
  }
}
```

::: warning
所桥接的组件内需要初始化任何东西都需要放到 桥接文件的init中去
:::

使用 `ComposeView` 桥接开发的组件

```kt title="BridgeView.kt"

package cn.mga1.wecode

import android.content.Context
import android.widget.LinearLayout
import androidx.compose.ui.platform.ComposeView

class WeCodeView(context: Context) : LinearLayout(context) {

    init {

        val composeView = ComposeView(context)
        composeView.setContent {
            TextLayoutCompose()
        }
        addView(composeView)
    }

}

```

打包需要配置的依赖

```json title="config.json"
"dependencies": [
  "androidx.activity:activity-compose:1.8.0",
  "androidx.compose.material3:material3:1.3.1",
  "androidx.compose.ui:ui:1.7.5",
  "androidx.compose.ui:ui-graphics:1.7.5",
  "androidx.compose.ui:ui-tooling-preview:1.7.5",
  "androidx.compose.runtime:runtime:1.7.5",
  "androidx.lifecycle:lifecycle-runtime-ktx:2.6.1"
],
```

```json title="pages.json"
  "app-plus": {
    "subNVues": [
      {
        "id": "access_widget",
        "path": "pages/launch/subNvue/index",
        "style": {
          "position": "absolute",
          "width": "710rpx",
          "height": "800rpx",
          "bottom": "20rpx",
          "top": "330rpx",
          "margin": "auto",
          "fontSize": "24upx",
          "background": "transparent",
          "mask": "rgba(0,0,0,0)",
          "zIndex": "1"
        }
      },
      {
        "id": "access_widget1",
        "path": "pages/launch/subNvue/index2",
        "style": {
          "position": "absolute",
          "width": "710rpx",
          "height": "800rpx",
          "bottom": "20rpx",
          "top": "340rpx",
          "margin": "auto",
          "fontSize": "24upx",
          "background": "transparent",
          "mask": "rgba(0,0,0,0)",
          "zIndex": "1"
        }
      }
    ]
  }
```
