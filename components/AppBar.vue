<template>
  <q-toolbar class="bg-grey-2 text-primary">

    <q-avatar class="gt-xs">
      <img src="/logo.png">
    </q-avatar>

    <q-btn-dropdown flat dropdown-icon="menu" class="xs">
      <q-list>
        <template v-for="(link, index) in topLinks.concat(user.name ?links : [])" :key="index">
          <q-item v-close-popup :to="link.url">
            <q-item-section class="text-subtitle1 text-primary">{{ link.title }}</q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-btn-dropdown>

    <q-space />

    <q-btn
        v-for="(link, index) in topLinks" :key="index" stretch flat color="primary" :label="link.title" :to="link.url" class="gt-xs"
    />

    <q-space />

    <q-btn-dropdown stretch flat label="Профиль">
      <q-list>
        <template v-for="(link, index) in profile" :key="index">
          <q-item v-close-popup :to="link.url">
            <q-item-section class="text-subtitle1 text-primary">{{ link.title }}</q-item-section>
          </q-item>
        </template>
        <q-item v-close-popup clickable to="/login" v-if="!user.name">
          <q-item-section class="text-subtitle1 text-primary">Войти</q-item-section>
        </q-item>
        <q-item v-close-popup clickable @click="logout" v-if="user.name">
          <q-item-section class="text-subtitle1 text-primary">Выйти</q-item-section>
        </q-item>
        <q-item v-close-popup clickable to="/registration" v-if="!user.name">
          <q-item-section class="text-subtitle1 text-primary">Зарегистрироваться</q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>

  </q-toolbar>
</template>

<script setup>
const { value: user } = useUser()
const jwtCookie = useCookie('jwt')
const links = user.role === 'Admin' ? useAdminLinks() : useLinks()

const topLinks = [
  { title: 'Главная', url: '/' }
]
const profile = [
  { title: 'Настройки', url: '/' }
]

function logout() {
  jwtCookie.value = null
  user.name = null
  user.email = null
  navigateTo('/')
}
</script>

<style scoped>
</style>
