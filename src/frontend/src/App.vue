<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script setup>
import { onMounted } from 'vue'
import { useDeviceStore } from '@/stores/device'

const deviceStore = useDeviceStore()

onMounted(() => {
  deviceStore.startRealtimeSimulation()
})
</script>

<style>
/* Vuetify 배경 투명 처리 */
.v-application {
  background: transparent !important;
}
</style>