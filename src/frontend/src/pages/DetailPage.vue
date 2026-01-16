<template>
  <div class="detail-page">
    <!-- 배경레이어 -->
    <div class="bg-layer-1"></div>
    <div class="bg-layer-2"></div>

    <!-- 상단 바 -->
    <DetailTopbar />

    <!-- 메인콘텐츠 -->
    <div class="detail-wrap">
      <DetailContent />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDeviceStore } from '@/stores/device'
import DetailTopbar from '@/components/detail/DetailTopbar.vue'
import DetailContent from '@/components/detail/DetailContent.vue'

const route = useRouter()
const deviceStore = useDeviceStore()

onMounted(() => {
  const deviceId = route.params.id
  if (deviceId) {
    deviceStore.setActivceDevice(deviceId)
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/style/detail.css';
</style>