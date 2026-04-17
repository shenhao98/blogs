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

### 3.在uniapp中使用

1. 创建一个libs文件夹，将aar文件放入libs文件夹中
2. 配置`config.json`

```json title="config.json"
{
  "minSdkVersion": "21",
  "dependencies": ["libs/facedetectionlib.aar"]
}
```
