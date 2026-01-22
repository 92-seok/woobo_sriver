<template>
  <div class="detail-page">
    <!-- 배경레이어 -->
    <div class="bg-layer-1"></div>
    <div class="bg-layer-2"></div>

    <!-- 상단 바 -->
    <DetailTopbar />

    <!-- 메인콘텐츠 -->
    <div class="sub-wrap">
      <DetailContent :device="activeDevice" />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useDeviceStore } from '@/stores/device'
import DetailTopbar from '@/components/detail/DetailTopbar.vue'
import DetailContent from '@/components/detail/DetailContent.vue'

const route = useRoute()
const deviceStore = useDeviceStore()

const activeDevice = computed(() => deviceStore.activeDevice)

onMounted(() => {
  document.body.classList.add('page-detail')
  const deviceId = route.params.id
  if (deviceId) {
    deviceStore.setActiveDevice(deviceId)
  }
})

onUnmounted(() => {
  document.body.classList.remove('page-detail')
})
</script>

<style lang="scss" scoped>
@import '@/assets/style/detail.css';
</style>