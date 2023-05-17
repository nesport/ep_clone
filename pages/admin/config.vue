<template>
  <q-img :src="config.MEDIA_UPLOADS + appConfig.logo.data.attributes.url" class="logo-image" />
  <q-input outlined v-model="appConfig.registerationEmail" label="Email регистрации" class="conf-input" />
  <q-input outlined v-model="appConfig.supportEmail" label="Email обратной связи" class="conf-input" />
  <q-btn unelevated color="primary" icon="save" label="Сохранить" @click="save" />
</template>

<script setup>
import { ref } from "vue";
definePageMeta({ middleware: 'admin' })

const config = useRuntimeConfig()
const appConfig = ref([])

appConfig.value = await apiFetch('/api/admin', {
  method: 'GET',
  params: { data: 'config' }
})

async function save() {
  await apiFetch('/api/admin', {
    method: 'POST',
    body: {
      data: {
        registerationEmail: appConfig.value.registerationEmail,
        supportEmail: appConfig.value.supportEmail
      }
    }
  })
}

</script>

<style lang="scss" scoped>
  .logo-image {
    height: 100px;
    max-width: 100px;
    border: 1px solid silver;
    //cursor: pointer;
    margin-bottom: 20px;
    border-radius: 5px;
  }
  .conf-input {
    width: 300px;
    margin-bottom: 20px;
  }
</style>
