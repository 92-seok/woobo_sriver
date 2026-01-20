<template>
  <div class="card" :class="[stageClass, { 'card--active': active }]" role="listitem" tabindex="0"
    @click="$emit('click')" @keydown.enter="$emit('click')" @keydown.space.prevent="$emit('click')">
    <div class="card__top">
      <div class="card__name">{{ device.name }}</div>

      <div class="card__status">
        <span class="card__dot" :class="netDotClass"></span>
        <span class="status-text" :class="netTextClass">
          {{ netLabel }}
        </span>
      </div>
    </div>

    <div class="card__addr">{{ device.addr }}</div>

    <div class="card__water">
      <div class="pill" :class="pillClass">
        {{ waterLabel }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { waterStageFrom, waterText, networkStage, networkLabel } from '@/utils/waterLevel'

const props = defineProps({
  device: {
    type: Object,
    required: true
  },
  active: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])

const stage = computed(() => waterStageFrom(props.device))
const netStage = computed(() => networkStage(props.device))
const netLabel = computed(() => networkLabel(props.device))

const stageClass = computed(() => `card--${stage.value}`)
const pillClass = computed(() => `pill--${stage.value}`)
const waterLabel = computed(() => waterText(stage.value))

const netDotClass = computed(() => `card__dot--${netStage.value}`)
const netTextClass = computed(() => `status-text--${netStage.value}`)
</script>

<style lang="scss" scoped></style>