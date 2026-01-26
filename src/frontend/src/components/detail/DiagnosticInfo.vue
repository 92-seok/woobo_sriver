  <template>
    <section class="sub-panel panel--diagnostic">
      <div class="sub-panel-hd">장비 진단 정보</div>
      <div class="sub-panel-bd">
        <div class="sub-kv">
          <div class="k">S/W 버전</div>
          <div class="v">{{ SW_VERSION }}</div>

          <div class="k">F/W 버전</div>
          <div class="v">{{ FW_VERSION }}</div>

          <div class="k">마지막 재부팅</div>
          <div class="v">{{ LastDate }}</div>

          <div class="k">수위계 상태</div>
          <div class="v">
            <span :class="['sub_pill', waterLevelStatusCode]">
              <span class="dot-10"></span>
              <span class="pill-text">{{ getStatusText(waterLevelStatusCode) }}</span>
            </span>
          </div>

          <div class="k">유속계 상태</div>
          <div class="v">
            <span :class="['sub_pill', velocityStatusCode]">
              <span class="dot-10"></span>
              <span class="pill-text">{{ getStatusText(velocityStatusCode) }}</span>
            </span>
          </div>

          <div class="k">연산장치</div>
          <div class="v">
            <span :class="['sub_pill', dischargeStatusCode]">
              <span class="dot-10"></span>
              <span class="pill-text">{{ getStatusText(dischargeStatusCode) }}</span>
            </span>
          </div>

          <div class="k">UPS 상태</div>
          <div class="v">
            <span :class="['sub_pill', upsStatusCode]">
              <span class="dot-10"></span>
              <span class="pill-text">{{ getStatusText(upsStatusCode) }}</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  </template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
  device: {
    type: Object,
    default: () => ({})
  }
})

const diagnosticData = ref(null)
const stationData = ref(null)

// 진단상태 데이터
async function fetchDiagnosticData() {
  if (!props.device?.id) return
  try {
    const res = await fetch(`/api/devices/${props.device.id}/data`)
    if (res.ok) {
      diagnosticData.value = await res.json()
    }
  } catch (e) {
    console.error('Failed to fetch diagnostic data: ', e)
  }
}

// 장비 스테이션 데이터
async function fetchStationData() {
  if (!props.device?.id) return
  try {
    const res = await fetch(`/api/devices/${props.device.id}/station`)
    if (res.ok) {
      stationData.value = await res.json()
    }
  } catch (e) {
    console.error('Failed to fetch diagnostic data: ', e)
  }
}


onMounted(() => {
  fetchDiagnosticData()
  fetchStationData()
})

watch(() => props.device?.id, () => {
  fetchDiagnosticData()
  fetchStationData()
})

// 상태 함수 모음
const getStatusClass = (code) => {
  if (!code) return 'bad'
  if (code.endsWith('0')) return 'good' // 00, 10, 20 = 정상
  if (code.endsWith('1')) return 'bad' // 01, 11, 21 = 비정상
  return 'unknown'
}

const getStatusText = (status) => {
  if (status === 'good') return '정상 (Operational)'
  return '비정상 (unknown)'
}

// 기존 정보 (props.device)
const SW_VERSION = computed(() => stationData.value?.SW_VERSION || '-')
const FW_VERSION = computed(() => stationData.value?.FW_VERSION || '-')
const LastDate = computed(() => stationData.value?.LastDate || '-')

// 상태 정보 (API 데이터)
const waterLevelStatusCode = computed(() => getStatusClass(diagnosticData.value?.waterLevelStatusCode))
const velocityStatusCode = computed(() => getStatusClass(diagnosticData.value?.velocityStatusCode))
const dischargeStatusCode = computed(() => getStatusClass(diagnosticData.value?.dischargeStatusCode))
const upsStatusCode = computed(() => getStatusClass(diagnosticData.value?.upsStatusCode))

// 
</script>

<style lang="scss"></style>