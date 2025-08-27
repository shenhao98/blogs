
## github无法推送

设置git代理
``` cmd
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy http://127.0.0.1:7890
```
<code>--unset</code>为取消代理，<code>7890</code>为Clash代理端口，需要开启局域网连接