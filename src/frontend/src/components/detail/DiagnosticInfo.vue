  <template>
    <section class="sub-panel panel--diagnostic">
      <div class="sub-panel-hd">장비 진단 정보</div>
      <div class="sub-panel-bd">
        <div class="sub-kv">
          <div class="k">S/W 버전</div>
          <div class="v">{{ swVersion }}</div>

          <div class="k">F/W 버전</div>
          <div class="v">{{ fwVersion }}</div>

          <div class="k">마지막 재부팅</div>
          <div class="v">{{ lastReboot }}</div>

          <div class="k">수위계 상태</div>
          <div class="v">
            <span :class="['sub_pill', waterMeterStatus]">
              <span class="dot-10"></span>
              <span class="pill-text">{{ getStatusText(waterMeterStatus) }}</span>
            </span>
          </div>

          <div class="k">유속계 상태</div>
          <div class="v">
            <span :class="['sub_pill', velocityMeterStatus]">
              <span class="dot-10"></span>
              <span class="pill-text">{{ getStatusText(velocityMeterStatus) }}</span>
            </span>
          </div>

          <div class="k">연산장치</div>
          <div class="v">
            <span :class="['sub_pill', processorStatus]">
              <span class="dot-10"></span>
              <span class="pill-text">{{ getStatusText(processorStatus) }}</span>
            </span>
          </div>

          <div class="k">UPS 상태</div>
          <div class="v">
            <span :class="['sub_pill', upsStatus]">
              <span class="dot-10"></span>
              <span class="pill-text">{{ getStatusText(upsStatus) }}</span>
            </span>
          </div>
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

const getStatusText = (status) => {
  if (status === 'good') return '정상 (Operational)'
  if (status === 'warn') return '주의'
  return '오류'
}

const swVersion = computed(() => props.device?.swVersion || '1.4.3.0')
const fwVersion = computed(() => props.device?.fwVersion || '-')
const lastReboot = computed(() => props.device?.lastReboot || '-')
const waterMeterStatus = computed(() => props.device?.waterMeterStatus || 'good')
const velocityMeterStatus = computed(() => props.device?.velocityMeterStatus || 'good')
const processorStatus = computed(() => props.device?.processorStatus || 'good')
const upsStatus = computed(() => props.device?.upsStatus || 'good')
</script>

<style lang="scss"></style>