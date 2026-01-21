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
import { waterStageFrom } from '@/utils/waterLevel'
import DevicePopup from './DevicePopup.vue'

const router = useRouter()
const deviceStore = useDeviceStore()

const {
  map,
  isLoaded,
  error,
  initMap,
  clearOverlays,
  panTo
} = useKakaoMap({
  lat: 36.4128,   // D-001 좌표로 초기 중심 설정
  lng: 128.1583,
  level: 8
})

const showPopup = ref(false)
const overlays = ref([])

const filteredDevices = computed(() => deviceStore.filteredDevices)
const activeDeviceId = computed(() => deviceStore.activeDeviceId)
const activeDevice = computed(() => deviceStore.activeDevice)

onMounted(async () => {
  await initMap('kakaoMap')
  if (isLoaded.value) {
    createMarkers()
  }
})

// 수위 상태별 마커 dot 클래스
function getMarkerDotClass(device) {
  const stage = waterStageFrom(device)
  return `nm-dot nm-dot--${stage}`
}

// CustomOverlay로 마커 생성
function createMarkers() {
  // 기존 오버레이 제거
  overlays.value.forEach(overlay => overlay.setMap(null))
  overlays.value = []

  filteredDevices.value.forEach(device => {
    // lat/lon 좌표가 있는 경우에만 마커 생성
    if (device.lat && device.lon) {
      const position = new window.kakao.maps.LatLng(device.lat, device.lon)

      const content = document.createElement('div')
      content.className = 'map-marker'
      content.dataset.id = device.id
      content.innerHTML = `<span class="${getMarkerDotClass(device)}"></span>`

      content.addEventListener('click', (e) => {
        e.stopPropagation() // 이벤트 전파 중단하기(팝업 안나옴)
        e.preventDefault()
        handleMarkerClick(device.id)
      })

      const overlay = new window.kakao.maps.CustomOverlay({
        position,
        content,
        yAnchor: 0.5,
        xAnchor: 0.5
      })

      overlay.setMap(map.value)
      overlays.value.push(overlay)
    }
  })
}

function handleMarkerClick(deviceId) {
  deviceStore.setActiveDevice(deviceId)
  showPopup.value = true

  const device = filteredDevices.value.find(d => d.id === deviceId)
  if (device?.lat && device?.lon) {
    requestAnimationFrame(() => {
      panTo(device.lat, device.lon)
    })
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
    if (device?.lat && device?.lon) {
      panTo(device.lat, device.lon)
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

// 카카오맵 CustomOverlay용 마커 스타일
:global(.map-marker) {
  cursor: pointer;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
}

:global(.nm-dot) {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  box-shadow: 0 0 0 6px rgba(255, 255, 255, .32);
  border: 2px solid rgba(0, 0, 0, .50);
}

:global(.nm-dot--ok) {
  background: #27c46b;
  box-shadow: 0 0 0 8px rgba(39, 196, 107, .68);
}

:global(.nm-dot--caution) {
  background: #f7c948;
  box-shadow: 0 0 0 8px rgba(247, 201, 72, .66);
}

:global(.nm-dot--warn) {
  background: #ff9f1a;
  box-shadow: 0 0 0 8px rgba(255, 159, 26, .66);
}

:global(.nm-dot--crit) {
  background: #ff4d4f;
  box-shadow: 0 0 0 8px rgba(255, 77, 79, .66);
}

:global(.nm-dot--unk) {
  background: #9aa7b7;
  box-shadow: 0 0 0 8px rgba(154, 167, 183, .62);
}
</style>