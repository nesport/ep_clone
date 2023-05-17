<template>
  <q-page-sticky position="bottom-right" :offset="[25, 25]" v-if="user.name">
    <q-btn fab icon="feedback" color="accent" @click="openDialog" />
  </q-page-sticky>

  <q-dialog v-model="formDialog" position="right" square seamless>
    <q-card class="q-pa-sm" style="min-width: 400px">
      <q-card-section class="row items-center q-pb-none q-pb-sm">
        <div class="text-h6">Обратная связь</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="q-pt-none" v-if="!feedbackResponse">
        <q-input v-model="messageText" outlined type="textarea" />
        <q-img :src="messageImage" class="message-image q-mt-md" v-if="messageImage" @click="imageDialog = true" />
      </q-card-section>
      <q-card-section class="q-pt-none" v-if="feedbackResponse">
        <q-banner class="text-green-8">
          <template v-slot:avatar>
            <q-icon name="check_circle" color="green-8" />
          </template>
          <div>Сообщение отправлено</div>
          <div>Спасибо за обратную связь</div>
        </q-banner>
      </q-card-section>
      <q-card-actions align="right" class="text-primary" v-if="!feedbackResponse">
        <q-btn unelevated color="primary" label="Отправить" @click="sendMail" :disable="!messageText" />
        <q-btn flat label="+ Cкриншот" @click="screenshot" />
        <q-btn flat label="Отмена" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="formDialog" full-width full-height :style="{ display: !imageDialog ? 'none' : null }">
    <q-card class="q-pa-sm">
      <q-card-section class="row items-center q-pb-none q-pb-sm">
        <div class="text-h6">Cкриншот</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="imageDialog = false" />
      </q-card-section>

      <q-card-section ref="canvasContainer" class="q-pt-none" style="height: calc(100vh - 180px)">
        <canvas
          ref="imageCanvas" :width="windowWidth" :height="windowHeight" class="image-canvas" @mousemove="draw"
          :style="{ cursor: drawMode ? 'crosshair' : 'default' }"
        />
      </q-card-section>

      <q-card-actions align="center">
        <q-btn unelevated color="primary" label="OK" @click="saveImage" class="q-mr-md" />
        <q-btn unelevated color="secondary" icon="brush" @click="prepareBrush" class="q-mr-md" />
        <q-btn unelevated color="negative" label="Удалить" @click="deleteImage" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'
import html2canvas from 'html2canvas'

const { value: user } = useUser()
const windowWidth = ref(window.innerWidth)
const windowHeight = ref(window.innerHeight)
const feedbackResponse = ref(null)
const formDialog = ref(false)
const imageDialog = ref(false)
const imageCanvas = ref(null)
const messageText = ref('')
const messageImage = ref(null)
const drawMode = ref(false)
let context = null

function screenshot() {
  html2canvas(document.body, {
    canvas: imageCanvas.value,
    width: window.innerWidth,
    height: window.innerHeight,
    x: window.pageXOffset,
    y: window.pageYOffset
  }).then(canvas => {
    messageImage.value = canvas.toDataURL("image/jpeg")
  })
}

function openDialog() {
  feedbackResponse.value = null
  formDialog.value = true
  drawMode.value = false
}

function deleteImage() {
  messageImage.value = null
  imageDialog.value = false
}

function prepareBrush() {
  context = imageCanvas.value.getContext("2d")
  context.lineWidth = 3
  context.strokeStyle = "red"
  drawMode.value = true
}

function draw (e) {
  if (drawMode.value) {
    const c = e.target.width / e.target.clientWidth
    const x = e.offsetX * c
    const y = e.offsetY * c
    const dx = e.movementX * c
    const dy = e.movementY * c

    if (e.buttons > 0) {
      context.beginPath()
      context.moveTo(x, y)
      context.lineTo(x - dx, y - dy)
      context.stroke()
      context.closePath()
    }
  }
}

function saveImage() {
  messageImage.value = imageCanvas.value.toDataURL("image/jpeg")
  imageDialog.value = false
}

async function sendMail() {
  const res = await apiFetch('/api/feedback', {
    method: 'POST',
    body: {
      name: user.name,
      email: user.email,
      text: messageText.value,
      image: messageImage.value
    }
  })
  if (res) {
    feedbackResponse.value = res.sent
    messageText.value = null
    messageImage.value = null
  }
}
</script>

<style scoped>
  .image-canvas {
    max-width: 100%;
    max-height: 100%;
    border: 2px solid silver;
  }
  .message-image {
    border: 1px solid silver;
    cursor: pointer
  }
</style>
