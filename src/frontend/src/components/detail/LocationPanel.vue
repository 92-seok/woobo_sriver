  <template>
    <section class="sub-panel panel--location">
      <div class="sub-panel-hd">장비 위치</div>

      <div class="sub-panel-bd">
        <div class="text-helper">
          위도&nbsp;: &nbsp;<span>{{ latDisplay }}</span> &nbsp;&nbsp; / &nbsp;&nbsp; 경도&nbsp;:
          &nbsp;<span>{{ lonDisplay }}</span>
        </div>

        <div class="map-sub-wrap">
          <div id="detailKakaoMap" class="detail-map"> </div>
        </div>

        <div class="video-actions">
          <v-btn class="btn btn-soft" @click="copyAddress">
            <i data-lucide="copy" class="btn__icon mr-2"></i>
            주소 복사
          </v-btn>
          <v-btn class="btn btn-ghost" @click="openNaverMap">
            <i data-lucide="map" class="btn__icon mr-2"></i>
            네이버 지도
          </v-btn>
        </div>
      </div>
    </section>
  </template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useKakaoMap } from '@/composables/useKakaoMap'
import { waterStageFrom } from '@/utils/waterLevel'

const props = defineProps({
  device: {
    type: Object,
    default: () => ({})
  }
})

const lat = computed(() => (props.device?.lat ?? 36.618588).toFixed(8))
const lng = computed(() => (props.device?.lng ?? 127.510997).toFixed(8))
const address = computed(() => props.device?.addr || '')

const latDisplay = computed(() => Number(props.device?.lat ?? 36.4128.toFixed(6)))
const lonDisplay = computed(() => Number(props.device?.lon ?? 128.1583.toFixed(6)))

// 카카오맵 Composable
const { map, isLoaded, initMap }
  = useKakaoMap({
    lat: lat.value,
    lng: lng.value,
    level: 5, // 상세페이지는 좀 더 가까이 보이기
  })

// 마커, 오버레이 저장
let overlay = null

function getMarkerDotClass() {
  const stage = waterStageFrom(props.device)
  return `nm-dot nm-dot--${stage}`
}

// 지도 초기화 및 마커 생성하기
async function setupMap() {
  await initMap('detailKakaoMap')
  if (isLoaded.value && map.value) {
    createMarker()
  }
}

// 마커 생성하기
function createMarker() {
  if (!map.value || !lat.value || !lng.value) return

  // 기존 마커 제거
  if (overlay) {
    overlay.setMap(null)
  }

  const position = new window.kakao.maps.LatLng(lat.value, lng.value)

  const content = document.createElement('div')
  content.className = 'map-marker'
  content.innerHTML = `<span class="${getMarkerDotClass()}"></span>`

  overlay = new window.kakao.maps.CustomOverlay({
    position,
    content,
    xAnchor: 0.5,
    yAnchor: 0.5,
  })

  overlay.setMap(map.value)
  // 지도 중심 이동
  map.value.setCenter(position)
}

// 주소 복사
const copyAddress = async () => {
  try {
    await navigator.clipboard.writeText(address.value)
    alert('주소를 복사했습니다.')
  } catch (e) {
    alert('복사 실패: 브라우저 권한을 확인하세요.')
  }
}

// 네이버 지도 열기
const openNaverMap = () => {
  const url = `https://map.naver.com/v5/?c=${lng.value},${lat.value},15,0,0,0,dh`
  window.open(url, '_blank', 'noopener,noreferrer')
}

// device 변경 시 마커 갱신
watch(() => props.device, () => {
  if (isLoaded.value) {
    createMarker()
  }
}, { deep: true })

onMounted(() => {
  window.lucide?.createIcons()
  setupMap()
})
</script>

<style lang="scss" scoped>
.detail-map {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.map-sub-wrap {
  position: relative;
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