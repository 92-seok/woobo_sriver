<template>
  <section class="sub-panel panel--realtime">
    <div class="sub-panel-hd">실시간 계측 정보 (최종)</div>
    <div class="sub-panel-bd">
      <div class="sub-kv">
        <div class="k">계측 시간</div>
        <div class="v">{{ measTime }}</div>

        <div></div>
        <div></div>

        <div class="k">수위(GL)</div>
        <div class="v">
          <span class="val">{{ waterLevel }}</span> m
        </div>

        <div class="k">평균 유속</div>
        <div class="v"><span>{{ velocity }}</span> m/s</div>

        <div class="k">총 유량</div>
        <div class="v"><span>{{ flow }}</span> m³/s</div>

        <div class="k">바닥기준(EL)</div>
        <div class="v">
          <span class="val">{{ elLevel }}</span> m
        </div>

        <div class="k">합산수위(FL)</div>
        <div class="v">
          <span class="val">{{ flLevel }}</span> m
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  device: {
    type: Object,
    default: () => ({})
  }
})

const measTime = computed(() => props.device?.measTime || '2025-12-23 16:46:00')
const waterLevel = computed(() => (props.device?.water ?? 0).toFixed(3))
const velocity = computed(() => (props.device?.velocity ?? 0.151).toFixed(3))
const flow = computed(() => (props.device?.flow ?? 0.12).toFixed(3))
const elLevel = computed(() => (props.device?.el ?? 55.198).toFixed(3))
const flLevel = computed(() => (props.device?.fl ?? 55.198).toFixed(3))
</script>

<style lang="scss"></style>