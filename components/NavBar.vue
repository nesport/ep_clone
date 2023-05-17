<template>
  <q-drawer v-model="drawer" show-if-above :width="200" :breakpoint="600" bordered class="bg-grey-2" v-if="user.name">
    <q-scroll-area class="fit">
      <q-list>
        <template v-for="(link, index) in links" :key="index">
          <q-item :to="link.url">
            <q-item-section class="text-subtitle1 text-primary">{{ link.title }}</q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script setup>
import { ref } from 'vue'

const user = useUser()
const links = user.value.role === 'Admin' ? useAdminLinks() : useLinks()
const drawer = ref(false)
</script>

<style scoped>
</style>
