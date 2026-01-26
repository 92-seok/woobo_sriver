<template>
  <v-app>
    <router-view />
    <ToastContainer />
  </v-app>
</template>

<script setup>
import { onMounted } from 'vue'
import { useDeviceStore } from '@/stores/device'
import ToastContainer from '@/components/common/ToastContainer.vue'

const deviceStore = useDeviceStore()

onMounted(() => {
  deviceStore.startPolling(30000)
})
</script>

<style>
/* Vuetify 배경 투명 처리 */
.v-application {
  background: transparent !important;
}
</style>