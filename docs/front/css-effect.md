## 实现一个弯曲卡片

<div class="round-card">
  <div class="card">
    <div class="img">
      <div class="round-block">
      </div>
    </div>
    <div class="content">
      Hello World
    </div>
  </div>
</div>

<style scoped lang="scss">
  .round-card {
    display: flex;
    justify-content: center;
    .card {
      border-radius: 20px;
      overflow: hidden;
      width: 300px;
      color: #000;
      .img {
        width: 100%;
        height: 300px;
        background-image: url('/mianmian-square.jpg');
        background-size: cover;
        /* background: red; */
        overflow: hidden;
        position: relative;
        .round-block {
          position: absolute;
          height: 40px;
          width: 100%;
          transform: translateY(50%);
          border-radius: 80px;
          bottom: 0;
          background: #fff;
          /* background: blue; */
          &::after {
            content: "";
            position: absolute;
            height: 80px;
            width: 80px;
            border-radius: 100%;
            /* background: yellow; */
            right: 0;
            transform: translateY(-100%);
            box-shadow: 52px 44px 0 10px #fff;
          }
        }
      }
      .content {
        width: 300px;
        padding: 8px 16px;
        padding-bottom: 30px;
        box-sizing: border-box;
        background: #fff;
        font-size: 19px;
      }
    }
  }
</style>

实现原理，父元素overflow: hidden, 子元素绝对定位通过box-shadow实现圆形的第四象限圆弧

```html
<div class="card">
  <div class="img">
    <div class="round-block"></div>
  </div>
  <div class="content">Hello World</div>
</div>

<style scoped lang="scss">
  .card {
    border-radius: 20px;
    overflow: hidden;
    width: 300px;
    color: #000;
    .img {
      width: 100%;
      height: 300px;
      background-image: url('/mianmian-square.jpg');
      background-size: cover;
      /* background: red; */
      overflow: hidden;
      position: relative;
      .round-block {
        position: absolute;
        height: 40px;
        width: 100%;
        transform: translateY(50%);
        border-radius: 80px;
        bottom: 0;
        background: #fff;
        /* background: blue; */
        &::after {
          content: '';
          position: absolute;
          height: 80px;
          width: 80px;
          border-radius: 100%;
          /* background: yellow; */
          right: 0;
          transform: translateY(-100%);
          box-shadow: 52px 44px 0 10px #fff;
        }
      }
    }
    .content {
      width: 300px;
      padding: 8px 16px;
      padding-bottom: 30px;
      box-sizing: border-box;
      background: #fff;
      font-size: 19px;
    }
  }
</style>
```

## 环形进度条

<div class="circle-progress">
  <div class="circle-inner">75%</div>
</div>

<style>
  .circle-progress {
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 104px;
    height: 104px;
    border-radius: 50%;
    background: conic-gradient(#4299e1 75%, #e8eef7 0);
    box-shadow: 0 12px 22px rgba(66, 153, 225, 0.14);
  }
  .circle-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 82px;
    height: 82px;
    background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
    border-radius: 50%;
    box-shadow: inset 0 0 0 1px rgba(226, 232, 240, 0.9);
    font-size: 30px;
    font-weight: 700;
    color: #0f172a;
  }
</style>

```html
<div class="circle-progress">
  <div class="circle-inner">75%</div>
</div>

<style>
  .circle-progress {
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 104px;
    height: 104px;
    border-radius: 50%;
    background: conic-gradient(#4299e1 75%, #e8eef7 0);
    box-shadow: 0 12px 22px rgba(66, 153, 225, 0.14);
  }
  .circle-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 82px;
    height: 82px;
    background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
    border-radius: 50%;
    box-shadow: inset 0 0 0 1px rgba(226, 232, 240, 0.9);
    font-size: 30px;
    font-weight: 700;
    color: #0f172a;
  }
</style>
```
