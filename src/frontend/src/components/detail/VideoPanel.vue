  <template>
    <section class="sub-panel panel--video">
      <div class="sub-panel-hd">
        <div class="hd-left">실시간 영상</div>
        <div class="hd-right">
          <button class="btn btn--blue03 w-130px h-30px" type="button" @click="showHelp">
            <i data-lucide="pause-circle" class="btn__icon"></i>
            <span class="btn__text text-12">재생불가 도움말</span>
          </button>
        </div>
      </div>

      <div class="sub-panel-bd">
        <div>
          <div class="video-text" style="color: var(--muted); font-weight: 900">
            <span class="sub_pill sub_pill_02 good mb-2">
              <span class="dot-10"></span>
              <span class="pill-text-02">정상 (Operational)</span>
            </span>
            <span class="ml-10">장비와 통신이 정상입니다. 실시간 영상 재생이 가능합니다.</span>
          </div>
        </div>

        <div class="video-sub-wrap">
          <img alt="실시간 영상 썸네일" :src="videoThumbnail" />
          <div class="video-overlay"></div>
        </div>

        <div class="video-actions">
          <button class="btn btn-soft" @click="playVideo">
            <i data-lucide="play-circle" class="btn__icon"></i>
            영상 재생
          </button>
          <button class="btn btn-ghost" @click="standby">
            <i data-lucide="pause-circle" class="btn__icon"></i>
            대기 중
          </button>
        </div>
      </div>
    </section>
  </template>

<script setup>
import { computed, onMounted } from 'vue'
import cctvImg from '@/assets/img/cctv.png'
import { useToast } from '@/composables/useToast'

const props = defineProps({
  device: {
    type: Object,
    default: () => ({})
  }
})

const { show: toast } = useToast()

const videoThumbnail = computed(() => props.device?.img || cctvImg)

const showHelp = () => {
  window.location.href = '/help_playback.html'
}

const playVideo = () => {
  toast('여기에 스트리밍 재생 로직(HLS/RTSP 변환 등)을 연결하세요.')
}

const standby = () => {
  toast('대기 상태입니다.')
}

onMounted(() => {
  window.lucide?.createIcons()
})
</script>

<style lang="scss" scoped></style>