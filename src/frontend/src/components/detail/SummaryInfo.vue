<template>
  <section class="sub-panel panel--summary">
    <div class="sub-panel-hd">종합 정보</div>
    <div class="sub-panel-bd">
      <div class="sub-kv">
        <div class="k">주소</div>
        <div class="v">{{ address }}</div>

        <div class="k">종합상태</div>
        <div class="v">
          <span class="sub_pill" :class="statusClass">
            <span class="dot-10"></span>
            <span class="pill-text">{{ statusLabel }}</span>
          </span>
        </div>

        <div class="k">마지막 업데이트</div>
        <div class="v">{{ LastDate }}</div>

        <div class="k">설치일</div>
        <div class="v">{{ installDate }}</div>
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

const address = computed(() => props.device?.addr || '-')
const LastDate = computed(() => props.device?.LastDate || '-')
const installDate = computed(() => props.device?.installDate || '-')

// 종합상태
const statusClass = computed(() => {
  if (props.device?.netError) return 'error'
  if (!props.device?.online) return 'unknown'
  return 'good'
})

const statusLabel = computed(() => {
  if (props.device?.netError) return '오류 (error)'
  if (!props.device?.online) return '알 수 없음 (unknown)'
  return '정상 (Operational)'
})

</script>

<style lang="scss" scoped></style>