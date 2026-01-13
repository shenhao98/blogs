## gradle 无法下载

更换镜像地址 mirrors.cloud.tencent.com/gradle
如果还无法下载就把<code>bin.zip</code> 改为<code>all.zip</code>

```gradle-wrapper.properties
distributionUrl=https\://mirrors.cloud.tencent.com/gradle/gradle-8.13-all.zip
```
