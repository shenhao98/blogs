<template>
  <div class="watermark-card">
    <h1>
      🖼️ 全屏斜水印
      <small>倾斜·覆盖</small>
      <span class="badge">JPG压缩</span>
    </h1>

    <!-- 上传区 -->
    <div
      class="upload-area"
      @click="triggerUpload"
      @dragover.prevent="onDragOver"
      @dragleave="onDragLeave"
      @drop.prevent="onDrop"
    >
      <input type="file" ref="fileInputRef" accept="image/*" @change="onFileChange" style="display: none" />
      <div class="upload-label">
        <svg viewBox="0 0 24 24">
          <path
            d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"
          />
        </svg>
        <span>点击上传 / 拖拽照片</span>
        <span class="hint">JPG · PNG · WebP</span>
      </div>
    </div>

    <!-- 预览 -->
    <div class="preview-wrap">
      <img v-if="previewUrl" :src="previewUrl" alt="预览" class="preview-image" />
      <div v-else class="placeholder-text">📷 照片预览</div>
    </div>

    <!-- 控制：水印文字 -->
    <div class="control-row">
      <label for="watermarkInput">✏️ 水印文字</label>
      <input
        id="watermarkInput"
        type="text"
        v-model="watermarkText"
        placeholder="输入内容..."
        @keyup.enter="applyWatermark"
      />
    </div>

    <!-- 控制：压缩质量 -->
    <div class="quality-row">
      <label for="qualityRange">📦 JPG质量</label>
      <input id="qualityRange" type="range" min="10" max="100" v-model.number="quality" />
      <span class="q-value">{{ quality }}%</span>
    </div>

    <div class="btn-group">
      <button class="btn btn-primary" @click="applyWatermark">🌀 生成斜水印</button>
      <button class="btn btn-outline" @click="resetToOriginal">↺ 重置原图</button>
    </div>

    <div class="download-wrap">
      <button class="download-btn" :disabled="!canDownload" @click="downloadJPG">⬇️ 下载 JPG (压缩)</button>
    </div>
    <div class="footnote">水印以 45° 斜向平铺覆盖全屏 · 下载为 JPG 格式，支持调节压缩质量</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'

// ---------- 响应式状态 ----------
const fileInputRef = ref<HTMLInputElement | null>(null)
const previewUrl = ref<string | null>(null)
const watermarkText = ref('全屏斜水印')
const quality = ref(85)

// 原始文件 & canvas
const currentFile = ref<File | null>(null)
const originalCanvas = ref<HTMLCanvasElement | null>(null) // 无任何水印
const watermarkedCanvas = ref<HTMLCanvasElement | null>(null) // 带水印的 canvas

// 预览用的 blob URL (用于释放)
let previewBlobUrl: string | null = null

// 计算是否可以下载
const canDownload = computed(() => {
  return watermarkedCanvas.value !== null
})

// ---------- 工具函数 ----------
function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = (err) => reject(err)
      img.src = e.target?.result as string
    }
    reader.onerror = (err) => reject(err)
    reader.readAsDataURL(file)
  })
}

// 预览 canvas (PNG 无损预览)
function previewCanvas(canvas: HTMLCanvasElement): Promise<string> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (previewBlobUrl) URL.revokeObjectURL(previewBlobUrl)
      const url = URL.createObjectURL(blob!)
      previewUrl.value = url
      previewBlobUrl = url
      resolve(url)
    }, 'image/png')
  })
}

// ---------- 核心: 生成全屏斜向平铺水印 ----------
function generateFullscreenDiagonalWatermark(
  sourceImg: HTMLImageElement,
  text: string,
  targetWidth: number,
  targetHeight: number,
): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = targetWidth
  canvas.height = targetHeight
  const ctx = canvas.getContext('2d')!

  // 绘制原图
  ctx.drawImage(sourceImg, 0, 0, targetWidth, targetHeight)

  const watermarkText = text.trim()
  if (!watermarkText) return canvas

  // 水印参数
  const baseFontSize = Math.max(28, Math.min(targetWidth, targetHeight) * 0.055)
  const fontSize = Math.min(baseFontSize, 80)
  const angle = (-45 * Math.PI) / 180
  const spacingX = fontSize * 4.2
  const spacingY = fontSize * 3.8

  ctx.font = `700 ${fontSize}px "Segoe UI", "PingFang SC", Roboto, system-ui, sans-serif`
  const metrics = ctx.measureText(watermarkText)

  // 平铺覆盖
  const diag = Math.sqrt(targetWidth * targetWidth + targetHeight * targetHeight)
  const stepX = spacingX
  const stepY = spacingY
  const startX = -diag * 0.3
  const startY = -diag * 0.2
  const rows = Math.ceil((targetHeight + diag * 0.8) / stepY) + 2
  const cols = Math.ceil((targetWidth + diag * 0.8) / stepX) + 2

  const baseAlpha = 0.28

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = startX + c * stepX + (r % 2) * (stepX * 0.5)
      const y = startY + r * stepY

      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(angle)

      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
      ctx.shadowBlur = 16
      ctx.shadowOffsetX = 2
      ctx.shadowOffsetY = 2

      ctx.fillStyle = `rgba(255, 255, 255, ${baseAlpha})`
      ctx.font = `700 ${fontSize}px "Segoe UI", "PingFang SC", Roboto, system-ui, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(watermarkText, 0, 0)

      ctx.shadowBlur = 0
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0
      ctx.strokeStyle = `rgba(0, 0, 0, 0.15)`
      ctx.lineWidth = 1.8
      ctx.strokeText(watermarkText, 0, 0)

      ctx.restore()
    }
  }

  return canvas
}

// ---------- 应用水印 ----------
async function applyWatermark() {
  if (!currentFile.value) {
    alert('请先上传一张照片！')
    return
  }

  const text = watermarkText.value.trim() || ' '
  try {
    const img = await loadImageFromFile(currentFile.value)
    let w = img.naturalWidth || img.width
    let h = img.naturalHeight || img.height
    const MAX_DIM = 2400
    if (w > MAX_DIM || h > MAX_DIM) {
      const ratio = Math.min(MAX_DIM / w, MAX_DIM / h)
      w = Math.round(w * ratio)
      h = Math.round(h * ratio)
    }

    const canvas = generateFullscreenDiagonalWatermark(img, text, w, h)
    watermarkedCanvas.value = canvas

    // 预览 (无损 PNG)
    await previewCanvas(canvas)
  } catch (err) {
    console.error(err)
    alert('生成水印失败，请重试。')
  }
}

// ---------- 重置 ----------
async function resetToOriginal() {
  if (!currentFile.value) {
    previewUrl.value = null
    if (previewBlobUrl) {
      URL.revokeObjectURL(previewBlobUrl)
      previewBlobUrl = null
    }
    watermarkedCanvas.value = null
    return
  }

  try {
    const img = await loadImageFromFile(currentFile.value)
    const canvas = document.createElement('canvas')
    const w = img.naturalWidth || img.width
    const h = img.naturalHeight || img.height
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, 0, 0, w, h)

    originalCanvas.value = canvas
    watermarkedCanvas.value = canvas

    await previewCanvas(canvas)
  } catch (err) {
    console.error(err)
    alert('重置失败，请重新上传。')
  }
}

// ---------- 下载: JPG 压缩 ----------
function downloadJPG() {
  if (!watermarkedCanvas.value) {
    alert('请先上传图片并生成水印！')
    return
  }

  const qualityValue = quality.value / 100
  const link = document.createElement('a')
  link.download = `watermarked_${Date.now()}.jpg`
  link.href = watermarkedCanvas.value.toDataURL('image/jpeg', qualityValue)
  link.click()
}

// ---------- 上传事件 ----------
function triggerUpload() {
  fileInputRef.value?.click()
}

function onDragOver(e: DragEvent) {
  e.preventDefault()
  const target = e.currentTarget as HTMLElement
  target.style.background = '#e1eaf5'
  target.style.borderColor = '#5a7ea8'
}

function onDragLeave(e: DragEvent) {
  const target = e.currentTarget as HTMLElement
  target.style.background = '#f2f6fd'
  target.style.borderColor = '#b8c9e2'
}

function onDrop(e: DragEvent) {
  e.preventDefault()
  const target = e.currentTarget as HTMLElement
  target.style.background = '#f2f6fd'
  target.style.borderColor = '#b8c9e2'

  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    handleFile(files[0])
  }
}

async function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    await handleFile(file)
  }
  // 重置 input 以便重复上传同一文件
  input.value = ''
}

async function handleFile(file: File) {
  currentFile.value = file

  if (previewBlobUrl) {
    URL.revokeObjectURL(previewBlobUrl)
    previewBlobUrl = null
  }

  try {
    const img = await loadImageFromFile(file)
    const canvas = document.createElement('canvas')
    const w = img.naturalWidth || img.width
    const h = img.naturalHeight || img.height
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, 0, 0, w, h)

    originalCanvas.value = canvas
    watermarkedCanvas.value = canvas

    await previewCanvas(canvas)

    if (!watermarkText.value.trim()) {
      watermarkText.value = '全屏斜水印'
    }
  } catch (err) {
    console.error(err)
    alert('图片加载失败，请换一张。')
  }
}

// ---------- 清理 ----------
onBeforeUnmount(() => {
  if (previewBlobUrl) {
    URL.revokeObjectURL(previewBlobUrl)
    previewBlobUrl = null
  }
})
</script>

<style scoped>
.watermark-card {
  margin-top: 16px;
  max-width: 920px;
  width: 100%;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 48px;
  padding: 32px 28px;
  box-shadow: 0 20px 48px rgba(0, 10, 30, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.5);
  transition: 0.25s;
  font-family:
    'Segoe UI',
    Roboto,
    system-ui,
    -apple-system,
    sans-serif;
}

h1 {
  font-size: 28px;
  font-weight: 600;
  color: #19243a;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 2px solid rgba(0, 0, 0, 0.05);
  letter-spacing: -0.3px;
  flex-wrap: wrap;
}

h1 small {
  font-size: 15px;
  font-weight: 400;
  background: #293b5a;
  color: white;
  padding: 2px 16px;
  border-radius: 40px;
  letter-spacing: 0.3px;
}

h1 .badge {
  font-size: 14px;
  background: #3d5a7a;
  color: white;
  padding: 2px 14px;
  border-radius: 30px;
  margin-left: 4px;
}

.upload-area {
  background: #f2f6fd;
  border-radius: 32px;
  padding: 28px 20px;
  text-align: center;
  border: 2px dashed #b8c9e2;
  transition: 0.2s;
  cursor: pointer;
  margin-bottom: 24px;
}

.upload-area:hover {
  background: #eaf0fa;
  border-color: #7a95bd;
}

.upload-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  color: #1f3252;
}

.upload-label svg {
  width: 44px;
  height: 44px;
  fill: #3d5780;
  opacity: 0.6;
}

.upload-label .hint {
  font-size: 14px;
  opacity: 0.6;
  font-weight: 400;
}

.preview-wrap {
  position: relative;
  border-radius: 28px;
  overflow: hidden;
  background: #d3dceb;
  box-shadow: inset 0 4px 10px rgba(0, 0, 0, 0.03);
  margin: 16px 0 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 260px;
}

.preview-image {
  display: block;
  max-width: 100%;
  max-height: 520px;
  width: auto;
  height: auto;
  object-fit: contain;
  transition: 0.2s;
}

.placeholder-text {
  color: #4c6285;
  font-weight: 400;
  padding: 40px 20px;
  opacity: 0.5;
  font-size: 20px;
  letter-spacing: 0.4px;
}

.control-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px 20px;
  background: #f3f7fe;
  padding: 14px 22px;
  border-radius: 60px;
  margin: 10px 0 18px;
  backdrop-filter: blur(4px);
}

.control-row label {
  font-weight: 500;
  color: #1b2a46;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
}

.control-row input {
  flex: 1;
  min-width: 140px;
  border: none;
  background: rgba(255, 255, 255, 0.7);
  padding: 12px 18px;
  border-radius: 40px;
  font-size: 16px;
  outline: 1px solid #cbd8ec;
  transition: 0.2s;
  color: #0d1a2f;
}

.control-row input:focus {
  outline: 2px solid #2f4b78;
  background: white;
  box-shadow: 0 4px 14px rgba(36, 70, 130, 0.12);
}

.quality-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 24px;
  background: #f3f7fe;
  padding: 12px 22px;
  border-radius: 60px;
  margin: 6px 0 16px;
}

.quality-row label {
  font-weight: 500;
  color: #1b2a46;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
}

.quality-row input[type='range'] {
  flex: 1;
  min-width: 120px;
  accent-color: #1f3b62;
  height: 6px;
  border-radius: 10px;
  background: #d0dcee;
}

.quality-row .q-value {
  font-weight: 600;
  color: #1a2c4a;
  min-width: 44px;
  text-align: center;
  background: rgba(255, 255, 255, 0.5);
  padding: 4px 12px;
  border-radius: 30px;
  font-size: 15px;
}

.btn-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 14px;
  margin: 6px 0 18px;
}

.btn {
  border: none;
  background: white;
  padding: 14px 28px;
  border-radius: 60px;
  font-weight: 600;
  font-size: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #1b2a44;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  cursor: pointer;
  transition: 0.2s;
  flex: 1 1 auto;
  min-width: 120px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(4px);
}

.btn-primary {
  background: #1b2f4e;
  color: white;
  border: 1px solid #2f4468;
  box-shadow: 0 8px 20px rgba(22, 40, 72, 0.25);
}

.btn-primary:hover {
  background: #274368;
  transform: scale(1.02);
}

.btn-outline {
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid #c2d2ea;
}

.btn-outline:hover {
  background: white;
  border-color: #8aa2c9;
}

.btn:disabled {
  opacity: 0.4;
  pointer-events: none;
  filter: grayscale(0.4);
}

.download-wrap {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}

.download-btn {
  width: 100%;
  padding: 18px;
  font-size: 18px;
  border-radius: 60px;
  background: #13243f;
  color: white;
  border: none;
  font-weight: 600;
  letter-spacing: 0.4px;
  transition: 0.2s;
  box-shadow: 0 6px 18px rgba(10, 30, 60, 0.25);
  cursor: pointer;
}

.download-btn:hover:not(:disabled) {
  background: #0b1a30;
  transform: scale(1.01);
  box-shadow: 0 10px 28px rgba(8, 25, 55, 0.35);
}

.download-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.footnote {
  margin-top: 20px;
  font-size: 14px;
  color: #4d6283;
  text-align: center;
  opacity: 0.65;
}

@media (max-width: 600px) {
  .watermark-card {
    padding: 20px 14px;
  }
  .control-row,
  .quality-row {
    border-radius: 32px;
    flex-direction: column;
    align-items: stretch;
  }
  .btn {
    min-width: 100px;
    padding: 12px 16px;
  }
  h1 {
    font-size: 22px;
  }
}
</style>
