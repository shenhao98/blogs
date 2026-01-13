## 公众号注册 sdk 问题

iPhone 注册 sdk 会提示 config:invalid signature
生成签名的 url 路径

```js title="App.vue"
// 获取第一次打开的页面路径
uni.setStorageSync('firstEntryUrl', location.href)
```

```js
// 在注册sdk生成签名时的url路径
let url = encodeURIComponent(location.href)
const { osName } = uni.getSystemInfoSync()
if (osName === 'ios') {
  url = encodeURIComponent(uni.getStorageSync('firstEntryUrl').split('#')[0])
}
```
