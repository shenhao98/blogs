---
lang: zh-CN
title: DevEco
createTime: 2025/06/05 14:45:19
permalink: /article/qqwhg9x6/
---
# 1. entry跳转到feature模块
  ```ets
   let want: Want = {
      bundleName: 'com.example.myapplication1', // 项目包名
      abilityName: 'Feature2Ability', // feature模块的module.json5文件下abilities数组对象的name
      moduleName: 'feature2' // feature模块的name字段
    };
    let context = getContext(this) as common.UIAbilityContext;
    context.startAbility(want).catch((err: BusinessError) => {
      console.log(err.message)
    });
  ```
  有可能点击跳转会出现红色警告，解决办法首先选择<code>entry</code>的模块再点击<code>Edit Configurations...</code>配置<code>Deploy Multi Hap</code>勾选目标跳转的feature模块


