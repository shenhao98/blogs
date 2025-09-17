## 撤销某次提交并且可以重新修改
<code>HEAD~n</code>的n代表第几次提交记录
``` bash
git reset --soft HEAD~n
```

## 删除某个历史提交记录
1.执行交互式 rebase 命令，指定要修改的提交范围：
``` bash
git rebase -i 目标提交的前一个提交ID
```

2.在打开的编辑器中，找到你要删除的提交那一行，将行首的pick改为drop

3.保存并关闭编辑器，Git 会执行 rebase 操作

4.完成后，如果该分支已推送到远程仓库，需要强制推送更新：
``` bash
git push --force-with-lease 远程仓库名 分支名
```