<template>
  <div class="q-pa-md row justify-center">
    <q-card class="my-card">
      <q-card-section>
        <q-form @submit="login" class="q-gutter-md">

          <q-input outlined v-model="loginData.login" label="Логин"/>
          <q-input outlined type="password" v-model="loginData.password" label="Пароль"/>

          <div class="row justify-center">
            <q-btn label="Вход" type="submit" unelevated color="primary" :disable="!loginData.login || !loginData.password"/>
          </div>

        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const jwtCookie = useCookie('jwt', {
  maxAge: 86400 * 30,
  sameSite: 'lax'
})
const user = useUser()

const loginData = ref({
  login: '',
  password: ''
})

async function login() {
  const userData = await apiFetch('/api/auth', {
    method: 'POST',
    body: { ...loginData.value }
  })
  if (userData) {
    jwtCookie.value = userData.jwt
    user.username = userData.user.username
    user.email = userData.user.email
    navigateTo('/')
  }
}
</script>

<style lang="scss" scoped>
.q-card {
  width: 100%;
  max-width: 400px;
  .q-btn {
    min-width: 100px;
  }
}
</style>
