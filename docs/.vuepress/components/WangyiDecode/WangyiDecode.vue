<template>
  <div class="cover-container">
    <div class="cover" @click="chooseFile">
      <div class="cover-img" :style="{ backgroundImage: `url(${songInfo.picture || `/blogs/mianmian-square.jpg`})` }"/>
    </div>
    <div class="body">
      <div class="song">
        <div class="title">{{songInfo.title || '绵崽'}}</div>
        <div class="dec">{{songInfo.artist}} - {{songInfo.album}}</div>
      </div>
      <audio v-if="songInfo.file" :src="songInfo.file" controls/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { decryptNCM } from './index'
import { ref } from 'vue'

const songInfo = ref<any>({})

const chooseFile = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.ncm'
  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files![0]
    const result = await decryptNCM(file)
    songInfo.value = result
    console.log(result)
  }
  input.click()
}
</script>

<style lang="scss" scoped>
.cover-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .cover {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 300px;
    .cover-img {
      background-image: attr(picture);
      background-size: cover;
      border-radius: 8px;
      height: 300px;
      width: 100%;
    }
  }
  .body {
    width: 300px;
    margin-top: 8px;
    audio {
      margin-top: 8px;
    }
    .song {
      .title {
        font-size: 20px;
        font-weight: bold;
      }
      .dec {
        font-size: 14px;
        color: #cccccc;
      }
    }
  }
}
</style>