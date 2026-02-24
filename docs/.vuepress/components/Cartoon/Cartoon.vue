<template>
  <div class="imgs" ref="imgsRef"></div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
const imgsRef = ref()
const generateImg = () => {
  const imgEl = document.createElement('img')
  imgEl.src = 'https://timg.cheems.ru?t=' + Date.now()
  imgEl.alt = '骚等片刻'
  console.log('imgsRef.value -->', imgsRef.value)
  imgsRef.value.appendChild(imgEl)
}

let timer,
  count = 1

onMounted(() => {
  generateImg()
  timer = setInterval(() => {
    generateImg()
    count++
    if (count > 8) {
      clearInterval(timer)
    }
  }, 100)
})
</script>

<style lang="scss" scoped>
.imgs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 16px;
  img {
    aspect-ratio: 9 / 16;
  }
}
</style>
