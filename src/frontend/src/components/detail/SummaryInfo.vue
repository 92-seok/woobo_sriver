<template>
  <section class="sub-panel panel--summary">
    <div class="sub-panel-hd">종합 정보</div>
    <div class="sub-panel-bd">
      <div class="sub-kv">
        <div class="k">주소</div>
        <div class="v">{{ address }}</div>

        <div class="k">종합상태</div>
        <div class="v">
          <span class="sub_pill good">
            <span class="dot-10"></span>
            <span class="pill-text">정상 (Operational)</span>
          </span>
        </div>

        <div class="k">마지막 업데이트</div>
        <div class="v">{{ lastUpdate }}</div>

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

const address = computed(() => props.device?.addr || '충청북도 청주시 상당구 용암동 2899')
const lastUpdate = computed(() => props.device?.lastUpdate || '2025-12-21 13:00:00')
const installDate = computed(() => props.device?.installDate || '2023-09-07')
</script>

<style lang="scss" scoped></style>