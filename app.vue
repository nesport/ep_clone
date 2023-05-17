<template>
  <q-layout view="hHh Lpr lff">
    <q-header elevated>
      <AppBar />
    </q-header>
    <NavBar />
    <q-page-container>
      <q-page padding>
        <NuxtPage />
        <client-only>
          <Feedback />
        </client-only>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
useHead({
  title: 'App',
  meta: [
    { name: 'description', content: 'App description' }
  ]
})
</script>
