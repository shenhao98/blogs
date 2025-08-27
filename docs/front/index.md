## oft字体在html中无法使用

### 疑问
比如<code>寒蝉活宋体_復_mianfeiziti.com.otf</code>这个字体有大约<code>30MB</code>,一开始我认为文件是损坏或者过大加载不出来，又或者网站不能加载<code>oft</code>格式的字体文件，但是后面经过电脑安装和其它工具的预览证明文件没问题网站上也是能预览，所以至今这个问题怀疑就是文件里面有些字符有毛病导致显示不出来。

### 解决办法
使用python安装这个库来处理 [git地址](https://github.com/fonttools/fonttools)
``` cmd
pip install fonttools
```

使用
``` cmd
pyftsubset ./target.otf --text-file=text.txt
```

<code>target.otf</code>是需要提取的字体文件，<code>text.txt</code>所要提取的文字，最后会在当前目录生成<code>target.subset.otf</code>，enjoy! 🥳
