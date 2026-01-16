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
.map-marker {
  position: absolute;
  transform: translate(-50%, -50%);
  width: 22px;
  height: 22px;
  border: 0;
  background: transparent;
  padding: 0;
  cursor: pointer;
  pointer-events: auto;
  transition: transform 0.2s ease;
}

.map-marker:focus-visible {
  outline: 3px solid rgba(73, 149, 255, .55);
  outline-offset: 2px;
  border-radius: 999px;
}

.map-marker.is-active .nm-dot {
  transform: scale(1.25);
  box-shadow: 0 0 0 10px rgba(73, 149, 255, .22);
}

.nm-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  box-shadow: 0 0 0 6px rgba(255, 255, 255, .32);
  border: 2px solid rgba(0, 0, 0, .50);
  display: block;
  margin: 4px;
  transition: all 0.3s ease;
}

.nm-dot--ok {
  background: #27c46b;
  box-shadow: 0 0 0 8px rgba(39, 196, 107, .68);
}

.nm-dot--caution {
  background: #f7c948;
  box-shadow: 0 0 0 8px rgba(247, 201, 72, .66);
}

.nm-dot--warn {
  background: #ff9f1a;
  box-shadow: 0 0 0 8px rgba(255, 159, 26, .66);
}

.nm-dot--crit {
  background: #ff4d4f;
  box-shadow: 0 0 0 8px rgba(255, 77, 79, .66);
}

.nm-dot--unk {
  background: #9aa7b7;
  box-shadow: 0 0 0 8px rgba(154, 167, 183, .62);
}
</style>