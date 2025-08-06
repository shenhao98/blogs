---
title: 前端开发中js使用的问题
createTime: 2025/06/06 16:02:28
permalink: /article/tl5f0ld9/
---

 ## debounce
 ```js
  debounce.call(
    this,
    function (text) { // 必须使用匿名函数，箭头函数没有this
      console.log(this)
    },
    300,
  )
 ```

  ## Promise
  ```js
  const fun = () => {
    return 1
  }
  const promiseResult = [fun].filter(async v => v() !== 1)
  console.log(promiseResult.length)  // 答案：length = 1
  ```

  可能细心的你会认为，<code>filter</code>和我平时用法没什么区别，那么结果应该是 <code>0</code>，但是结果是<code>1</code>，这是为什么呢？

  这是因为<code>filter</code>的回调函数返回的是一个<code>promise</code>，<code>filter</code>里面的函数每次执行返回都是真，那么结果当然是<code>1</code>咯！
