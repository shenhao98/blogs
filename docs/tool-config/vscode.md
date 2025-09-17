## 配置代码格式化-Prettier

首先在<code>setting.json</code>中指定使用 prettier 用于格式化，否则不会生效

```json title="setting.json"
"editor.defaultFormatter": "esbenp.prettier-vscode"
```

优先级：独立配置文件>vscode 工作区配置>vscode 用户配置

独立配置文件

::: warning 如果在 Prettier 相关的配置中勾选了 <code>Prettier: Require Config</code>的话那么你必须使用独立配置文件
:::

在电脑中新建 <code>.prettierrc</code>文件，找到设置中的<code>prettier.configPath</code>配置选项填入路径，就会使用本机的配置

在项目中新建该文件则只会使用当前项目的配置文件，优先级最大

如果既没有配置<code>configPath</code>也没有在项目中新增<code>.prettierrc</code>那么就会使用，vscode 的用户配置
