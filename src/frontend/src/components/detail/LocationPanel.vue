  <template>
    <section class="sub-panel panel--location">
      <div class="sub-panel-hd">장비 위치</div>

      <div class="sub-panel-bd">
        <div class="text-helper">
          위도&nbsp;: &nbsp;<span>{{ lat }}</span> &nbsp;&nbsp; / &nbsp;&nbsp; 경도&nbsp;:
          &nbsp;<span>{{ lng }}</span>
        </div>

        <div class="map-sub-wrap">
          <img alt="지도 썸네일" :src="mapImage" />
          <div class="video-overlay"></div>
        </div>

        <div class="video-actions">
          <v-btn class="btn btn-soft" @click="copyAddress">
            <v-icon class="mr-2">mdi-content-copy</v-icon>
            주소 복사
          </v-btn>
          <v-btn class="btn btn-ghost" @click="openNaverMap">
            <v-icon class="mr-2">mdi-map-outline</v-icon>
            네이버 지도
          </v-btn>
        </div>
      </div>
    </section>
  </template>

<script setup>
import { computed } from 'vue'
import mapImg from '@/assets/img/map.png'

const props = defineProps({
  device: {
    type: Object,
    default: () => ({})
  }
})

const lat = computed(() => (props.device?.lat ?? 36.618588).toFixed(8))
const lng = computed(() => (props.device?.lng ?? 127.510997).toFixed(8))
const address = computed(() => props.device?.addr || '충청북도 청주시 상당구 용암동 2899')
const mapImage = mapImg

const copyAddress = async () => {
  try {
    await navigator.clipboard.writeText(address.value)
    alert('주소를 복사했습니다.')
  } catch (e) {
    alert('복사 실패: 브라우저 권한을 확인하세요.')
  }
}

const openNaverMap = () => {
  const url = `https://map.naver.com/v5/?c=${lng.value},${lat.value},15,0,0,0,dh`
  window.open(url, '_blank', 'noopener,noreferrer')
}
</script>

<style lang="scss"></style>