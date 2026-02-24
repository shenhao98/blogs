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
