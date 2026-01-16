<template>
  <section class="map" aria-label="지도 영역">
    <!-- 지도 이미지 -->
    <div id="naverMap" class="map__canvas map__canvas--image" aria-label="지도 이미지">
      <img class="map__img" src="@/assets/img/map.png" alt="지도 이미지">
      <!-- 마커 레이어 -->
      <div class="map__markers" id="mapMarkers" aria-label="지도 마커 레이어">
        <DeviceMarker v-for="device in filteredDevices" :key="device.id" :device="device"
          :active="device.id === activeDeviceId" @click="handleMarkerClick(device.id)" />
      </div>
    </div>

    <!-- 팝업 -->
    <DevicePopup v-if="activeDevice" :device="activeDevice" :show="showPopup" @close="closePopup"
      @detail="goToDetail" />
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDeviceStore } from '@/stores/device'
import DeviceMarker from './DeviceMarker.vue'
import DevicePopup from './DevicePopup.vue'

const router = useRouter()
const deviceStore = useDeviceStore()

const showPopup = ref(false)

const filteredDevices = computed(() => deviceStore.filteredDevices)
const activeDeviceId = computed(() => deviceStore.activeDeviceId)
const activeDevice = computed(() => deviceStore.activeDevice)

function handleMarkerClick(deviceId) {
  deviceStore.setActiveDevice(deviceId)
  showPopup.value = true
}

function closePopup() {
  showPopup.value = false
}

function goToDetail() {
  if (activeDevice.value) {
    router.push({ name: 'Detail', params: { id: activeDevice.value.id } })
  }
}

// 팝업 위치 조정 (모바일 x)
function isMobilePopupMode() {
  return window.matchMedia("(pointer: coarse)").matches
}

function positionPopupNearMarker() {
  if (isMobilePopupMode()) return

  const popup = document.getElementById('devicePopup')
  const marker = document.querySelector(`.map-marker[data-id="${activeDeviceId.value}"]`)
  const map = document.querySelector('.map')

  if (!popup || !marker || !map) return

  const mapRect = map.getBoundingClientRect()
  const markerRect = marker.getBoundingClientRect()

  let x = (markerRect.left + markerRect.width / 2) - mapRect.left
  let y = markerRect.top - mapRect.top

  popup.style.left = x + 'px'
  popup.style.top = y + 'px'

  requestAnimationFrame(() => {
    const pRect = popup.getBoundingClientRect()
    const leftOverflow = pRect.left - mapRect.left
    const rightOverflow = mapRect.right - pRect.right

    if (leftOverflow < 8) x += (8 - leftOverflow)
    if (rightOverflow < 8) x -= (8 - rightOverflow)

    popup.style.left = x + 'px'
    popup.style.top = y + 'px'
  })
}

function handleResize() {
  if (isMobilePopupMode()) return
  if (showPopup.value && activeDeviceId.value) {
    positionPopupNearMarker()
  }
}

watch([showPopup, activeDeviceId], () => {
  if (showPopup.value && activeDeviceId.value) {
    setTimeout(positionPopupNearMarker, 10)
  }
})

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})


</script>

<style lang="scss" scoped></style>