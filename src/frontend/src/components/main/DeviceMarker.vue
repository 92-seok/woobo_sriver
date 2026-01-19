<template>
  <button type="button" class="map-marker" :class="{ 'is-active': active }"
    :style="{ left: `${device.pos.x}%`, top: `${device.pos.y}%` }" :data-id="device.id"
    :aria-label="`${device.name} 마커`" @click="$emit('click')">
    <span class="nm-dot" :class="dotClass"></span>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { waterStageFrom } from '@/utils/waterLevel'

const props = defineProps({
  device: {
    type: Object,
    required: true,
  },
  active: {
    type: Boolean,
    required: false,
  }
})

defineEmits(['click'])

const dotClass = computed(() => {
  const stage = waterStageFrom(props.device)
  return `nm-dot--${stage}`
})
</script>

<style lang="scss" scoped>
@import '@/assets/style/main-style.css';
</style>