<template>
  <section v-if="show" id="devicePopup" class="popup" :class="popupBorderClass" aria-label="장비 요약 팝업">
    <!-- 헤더 -->
    <div class="popup__head">
      <div class="popup__title">
        <i data-lucide="waves" class="btn__icon"></i>
        <strong>{{ device.name }}</strong>
      </div>

      <div class="popup__meta">
        <!-- 네트워크 상태 -->
        <div class="popup__net" :class="netClass">
          <span class="popup__dot" :class="netDotClass"></span>
          <span>{{ netLabel }}</span>
        </div>

        <!-- 수위 뱃지 -->
        <div class="popup__waterBadge" :class="waterBadgeClass">
          {{ waterBadgeText }}
        </div>
      </div>
    </div>

    <!-- 주소 -->
    <p class="popup__addr">{{ device.addr }}</p>

    <!-- 본문 -->
    <div class="popup__body">
      <div class="popup__map">
        <!-- 이미지 -->
        <figure class="thumb">
          <img :src="device.img || device.rtspImg || '/placeholder.jpg'" :alt="`${device.name} 현장 이미지`">
        </figure>

        <!-- 우측 정보 -->
        <div class="popup__right">
          <dl class="kv">
            <div class="kv__row">
              <dt><span class="mr-5 sq sq--unk"></span>함체높이(m)</dt>
              <dd>{{ device.height ?? '-' }} m</dd>
            </div>
            <div class="kv__row">
              <dt><span class="mr-5 sq sq--ok"></span>현재수위(m)</dt>
              <dd>{{ parseFloat(device.water_data).toFixed(2) ?? '-' }} m</dd>
            </div>
            <div class="kv__row">
              <dt><span class="mr-5 sq sq--caution"></span>주의 ({{ parseFloat(device.thresholdL1).toFixed(0) ?? 70 }}%)
              </dt>
              <dd> {{ device.thresholdL1_data.toFixed(2) }} m</dd>
            </div>
            <div class="kv__row">
              <dt><span class="mr-5 sq sq--warn"></span>경계 ({{ parseFloat(device.thresholdL2).toFixed(0) ?? 80 }}%)
              </dt>
              <dd> {{ device.thresholdL2_data.toFixed(2) }} m</dd>
            </div>
            <div class="kv__row">
              <dt><span class="mr-5 sq sq--crit"></span>심각 ({{ parseFloat(device.thresholdL3).toFixed(0) ?? 90 }}%)
              </dt>
              <dd> {{ device.thresholdL3_data.toFixed(2) }} m</dd>
            </div>
          </dl>
        </div>
      </div>

      <!-- 수위 게이지 바 -->
      <div class="waterbar" aria-label="실시간 수위">
        <div class="waterbar__label">
          <span>수위 게이지</span>
          <span class="waterbar__pct">{{ waterPct }}</span>
        </div>
        <div class="waterbar__track" role="img" aria-label="수위 진행 바">
          <div class="waterbar__fill" :style="{ width: waterPct, background: fillColor }"></div>
          <div class="waterbar__tick waterbar__tick--70" title="70%"></div>
          <div class="waterbar__tick waterbar__tick--80" title="80%"></div>
          <div class="waterbar__tick waterbar__tick--90" title="90%"></div>
        </div>
        <div class="waterbar__legend">
          <span class="lg lg--ok">정상(◀70)</span>
          <span class="lg lg--caution">주의(70)</span>
          <span class="lg lg--warn">경계(80)</span>
          <span class="lg lg--crit">심각(90)</span>
        </div>
      </div>
    </div>

    <!-- 푸터 버튼 -->
    <div class="popup__foot">
      <v-btn variant="text" class="btn-ghost" @click="$emit('close')">
        <i data-lucide="x" class="btn__icon mr-2"></i>
        <span>닫기</span>
      </v-btn>
      <v-btn variant="text" class="btn-soft" @click="$emit('detail')">
        <i data-lucide="search" class="btn__icon mr-2"></i>
        <span>상세보기</span>
      </v-btn>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, watch, nextTick } from 'vue'
import { waterStageFrom, waterText, networkStage, networkLabel, fillColorByStage, clamp } from '@/utils/waterLevel'

const props = defineProps({
  device: {
    type: Object,
    required: true
  },
  show: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close', 'detail'])

const stage = computed(() => waterStageFrom(props.device))
const netStage = computed(() => networkStage(props.device))
const netLabel = computed(() => networkLabel(props.device))

const waterBadgeClass = computed(() => `popup__waterBadge--${stage.value}`)
const waterBadgeText = computed(() => waterText(stage.value))

const netClass = computed(() => `popup__net--${netStage.value}`)
const netDotClass = computed(() => `popup__dot--${netStage.value}`)
const popupBorderClass = computed(() => `popup--net-${netStage.value}`)

const waterPct = computed(() => {
  if (props.device.water == null) return '0%'
  return `${clamp(props.device.water, 0, 100)}%`
})

const fillColor = computed(() => fillColorByStage(stage.value))

onMounted(() => {
  window.lucide?.createIcons()
})

watch(() => props.show, async (val) => {
  if (val) {
    await nextTick()
    window.lucide?.createIcons()
  }
})
</script>

<style lang="scss" scoped></style>