<template>
  <div class="row">
    <q-select
      outlined v-model="receiver" :options="usersList" @update:model-value="getMessages($event)"
      class="xs" style="width: 100%; padding-bottom: 20px" label="Пользователь"
    />
    <q-list bordered style="max-width: 300px; height: 100%; margin-right: 20px;" class="mes-panel gt-xs">
      <q-item
        v-for="(user, index) in usersList" :key="index" clickable v-ripple @click="getMessages(user)"
        :active="receiver === user"
      >
        <q-item-section>
          <q-item-label>{{user}}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <div class="column mes-panel" style="max-width: 600px" v-if="receiver">
      <q-input v-model="messageText" outlined type="textarea"/>
      <div class="row justify-center q-pa-md">
        <q-btn label="Отправить" color="primary" @click="sendMessage" />
      </div>
      <div class="q-pa-md" style="border-top: 1px solid gainsboro">
        <q-chat-message
          v-for="(mes, index) in messages" :key="index"
          :text="[mes.text]" :sent="mes.sent" :stamp="mes.stamp" :name="mes.sent ? user.name : receiver"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
definePageMeta({ middleware: 'auth' })

const { value: user } = useUser()

const messages = ref([])
const receiver = ref('')
const messageText = ref('')
const usersList = ref([])

usersList.value = await apiFetch('/api/messages', {
  method: 'GET',
  params: { username: user.name }
})

async function getMessages(name) {
  receiver.value = name
  messages.value = await apiFetch('/api/messages', {
    method: 'GET',
    params: {
      username: user.name,
      receiver: name
    }
  })
}

async function sendMessage() {
  await apiFetch('/api/messages', {
    method: 'POST',
    body: {
      sender_user: user.name,
      receiver_user: receiver.value,
      text: messageText.value
    }
  })
  messageText.value = ''
  getMessages(receiver.value)
}

</script>

<style lang="scss" scoped>
.mes-panel {
  flex:1 1 auto;
}
</style>
