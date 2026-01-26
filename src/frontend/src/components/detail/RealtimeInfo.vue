<template>
  <section class="sub-panel panel--realtime">
    <div class="sub-panel-hd">실시간 계측 정보 (최종)</div>
    <div class="sub-panel-bd">
      <div class="sub-kv">
        <div class="k">계측 시간</div>
        <div class="v">{{ DataTime }}</div>

        <div></div>
        <div></div>

        <div class="k">수위(GL)</div>
        <div class="v">
          <span class="val">{{ LOGGER_GL }}</span> m
        </div>

        <div class="k">평균 유속</div>
        <div class="v"><span>{{ averageVelocity }}</span> m/s</div>

        <div class="k">바닥기준(EL)</div>
        <div class="v">
          <span class="val">{{ LOGGER_EL }}</span> m
        </div>

        <div class="k">총 유량</div>
        <div class="v"><span>{{ totalDischarge }}</span> m³/s</div>

        <div class="k">합산수위(FL)</div>
        <div class="v">
          <span class="val">{{ LOGGER_FL }}</span> m
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import dayjs from 'dayjs'

const props = defineProps({
  device: {
    type: Object,
    default: () => ({})
  }
})

const realtimeData = ref(null)

async function fetchRealtimeData() {
  if (!props.device?.id) return
  try {
    const res = await fetch(`/api/devices/${props.device.id}/data`)
    if (res.ok) {
      realtimeData.value = await res.json()
    }
  } catch (e) {
    console.error('Failed to fetch realtime data: ', e)
  }
}

onMounted(() => fetchRealtimeData())
watch(() => props.device?.id, () => fetchRealtimeData())

const DataTime = computed(() => {
  const dt = realtimeData.value?.DataTime
  return dt ? dayjs(dt).format('YYYY-MM-DD HH:mm:ss') : '-'
})
const LOGGER_GL = computed(() => realtimeData.value?.LOGGER_GL != null ? realtimeData.value.LOGGER_GL.toFixed(3) : '-')
const LOGGER_EL = computed(() => realtimeData.value?.LOGGER_EL != null ? realtimeData.value.LOGGER_EL.toFixed(3) : '-')
const LOGGER_FL = computed(() => realtimeData.value?.LOGGER_FL != null ? realtimeData.value.LOGGER_FL.toFixed(3) : '-')
const averageVelocity = computed(() => realtimeData.value?.averageVelocity != null ? realtimeData.value?.averageVelocity.toFixed(3) : '-')
const totalDischarge = computed(() => realtimeData.value?.totalDischarge != null ? realtimeData.value?.totalDischarge.toFixed(3) : '-')
</script>

<style lang="scss"></style>