<template>
  <section class="map" aria-label="지도 영역">
    <!-- 카카오맵 컨테이너 -->
    <div id="kakaoMap" class="map__canvas" aria-label="카카오 지도"></div>

    <!-- 로딩 상태 -->
    <div v-if="!isLoaded && !error" class="map__loading">
      지도 로딩 중...
    </div>

    <!-- 에러 상태 -->
    <div v-if="error" class="map__error">
      {{ error }}
    </div>

    <!-- 팝업 -->
    <DevicePopup v-if="activeDevice" :device="activeDevice" :show="showPopup" @close="closePopup"
      @detail="goToDetail" />
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDeviceStore } from '@/stores/device'
import { useKakaoMap } from '@/composables/useKakaoMap'
import DevicePopup from './DevicePopup.vue'

const router = useRouter()
const deviceStore = useDeviceStore()

// 카카오맵 composable
const {
  map,
  isLoaded,
  error,
  initMap,
  addMarker,
  clearMarkers,
  panTo
} = useKakaoMap({
  lat: 36.4128,    // 초기 중심 위도 (경상도 일대)
  lng: 128.1583,   // 초기 중심 경도
  level: 10     // 초기 줌 레벨
})

const showPopup = ref(false)

const filteredDevices = computed(() => deviceStore.filteredDevices)
const activeDeviceId = computed(() => deviceStore.activeDeviceId)
const activeDevice = computed(() => deviceStore.activeDevice)

// 지도 초기화
onMounted(async () => {
  await initMap('kakaoMap')

  if (isLoaded.value) {
    createMarkers()
  }
})

// 마커 생성
function createMarkers() {
  clearMarkers()

  filteredDevices.value.forEach(device => {
    // 위경도 좌표가 있는 경우에만 마커 생성
    if (device.lat && device.lng) {
      addMarker({
        lat: device.lat,
        lng: device.lng,
        // imageSrc: getMarkerImage(device), // 커스텀 마커 이미지
        onClick: () => handleMarkerClick(device.id)
      })
    }
  })
}

// 수위 상태별 마커 이미지 (선택사항)
// function getMarkerImage(device) {
//   const stage = getWaterStage(device)
//   return `/markers/marker-${stage}.png`
// }

function handleMarkerClick(deviceId) {
  deviceStore.setActiveDevice(deviceId)
  showPopup.value = true

  // 클릭한 마커로 지도 이동
  const device = filteredDevices.value.find(d => d.id === deviceId)
  if (device?.lat && device?.lng) {
    panTo(device.lat, device.lng)
  }
}

function closePopup() {
  showPopup.value = false
}

function goToDetail() {
  if (activeDevice.value) {
    router.push({ name: 'Detail', params: { id: activeDevice.value.id } })
  }
}

// 필터링된 장비 목록 변경 시 마커 갱신
watch(filteredDevices, () => {
  if (isLoaded.value) {
    createMarkers()
  }
}, { deep: true })

// 활성 장비 변경 시 지도 이동
watch(activeDeviceId, (newId) => {
  if (newId && isLoaded.value) {
    const device = filteredDevices.value.find(d => d.id === newId)
    if (device?.lat && device?.lng) {
      panTo(device.lat, device.lng)
    }
  }
})
</script>

<style lang="scss" scoped>
.map {
  position: relative;
  width: 100%;
  height: 100%;
}

.map__canvas {
  width: 100%;
  height: 100%;
}

.map__loading,
.map__error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 16px 24px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  border-radius: 8px;
}

.map__error {
  background: rgba(255, 77, 79, 0.9);
}
</style>