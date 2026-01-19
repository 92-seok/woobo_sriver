<template>
  <div class="sub-grid">
    <!-- LEFT -->
    <div class="sub-stack sub-stack--left">
      <VideoPanel :device="device" />
      <ChartPanel :device="device" />
      <NetworkInfo :device="device" />
    </div>

    <!-- RIGHT -->
    <div class="sub-stack sub-stack--right">
      <SummaryInfo :device="device" />
      <RealtimeInfo :device="device" />
      <DiagnosticInfo :device="device" />
      <LocationPanel :device="device" />
    </div>
  </div>
</template>

<script setup>
import VideoPanel from '@/components/detail/VideoPanel.vue'
import ChartPanel from '@/components/detail/Chart.vue'
import NetworkInfo from '@/components/detail/NetworkInfo.vue'
import SummaryInfo from '@/components/detail/SummaryInfo.vue'
import RealtimeInfo from '@/components/detail/RealtimeInfo.vue'
import DiagnosticInfo from '@/components/detail/DiagnosticInfo.vue'
import LocationPanel from '@/components/detail/LocationPanel.vue'

defineProps({
  device: {
    type: Object,
    default: () => ({})
  }
})
</script>

<style></style>