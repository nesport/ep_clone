<template>
  <div class="q-pa-md row justify-center">
    <q-card class="my-card">
      <q-card-section>
        <q-form @submit="register" class="q-gutter-md" v-if="!registerResponse">

          <h6 class="row justify-center">
            Заявка на регистрацию
          </h6>

          <q-input outlined v-model="registerData.name" label="Имя"/>
          <q-input outlined v-model="registerData.surname" label="Фамилия"/>
          <q-input outlined v-model="registerData.companyName" label="Название компании"/>
          <q-input outlined v-model="registerData.companyINN" label="ИНН компании"/>
          <q-input outlined v-model="registerData.email" label="Email"/>

          <div class="row justify-center">
            <q-btn label="Отправить" type="submit" unelevated color="primary" :disable="Object.values(registerData).some(v => !v)"/>
          </div>

        </q-form>
        <q-banner class="text-green-8" v-else>
          <template v-slot:avatar>
            <q-icon name="check_circle" color="green-8" />
          </template>
          <div>Заявка на регистрацию отправлена</div>
          <div>Ожидайте ответа на указанный email</div>
          <div>{{registerData.email}}</div>
          <template v-slot:action>
            <q-btn flat color="white" label="Dismiss" />
            <q-btn flat color="white" label="Update Credit Card" />
          </template>
        </q-banner>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const registerData = ref({
  name: '',
  surname: '',
  companyName: '',
  companyINN: '',
  email: ''
})
const registerResponse = ref(null)

async function register() {
  const res = await apiFetch('/api/auth', {
    method: 'POST',
    body: { ...registerData.value }
  })
  if (res) {
    registerResponse.value = res.sent
  }
}
</script>

<style lang="scss" scoped>
.q-card {
  width: 100%;
  max-width: 400px;
}
</style>
