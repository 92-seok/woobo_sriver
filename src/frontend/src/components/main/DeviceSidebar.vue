<template>
  <aside class="sidebar" aria-label="장비 목록">
    <div class="sidebar__head">
      <div class="sidebar__title">
        <div>
          <span class="panel__icon" aria-hidden="true">
            <v-icon color="white">mdi-file-tree</v-icon>
          </span>
          <h2>장비 목록</h2>
        </div>
      </div>
      <div class="sidebar__count">
        <span>{{ deviceStore.filteredDevices.length }}</span>개
      </div>
    </div>

    <div class="list" role="list">
      <DeviceCard v-for="device in deviceStore.filteredDevices" :key="device.id" :device="device"
        :active="device.id === deviceStore.activeDeviceId" @click="handleCardClick(device.id)" />
    </div>
  </aside>
</template>

<script setup>
import { useDeviceStore } from '@/stores/device'
import DeviceCard from './DeviceCard.vue'

const deviceStore = useDeviceStore()

function handleCardClick(deviceId) {
  deviceStore.setActiveDevice(deviceId)
}
</script>

<style scoped></style>