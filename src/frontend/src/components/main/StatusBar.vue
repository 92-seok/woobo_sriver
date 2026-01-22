<template>
  <article class="panel" aria-label="장비 상태">
    <div class="panel__head">
      <div>
        <span class="panel__icon" aria-hidden="true">
          <i data-lucide="activity" class="btn__icon"></i>
        </span>
        <h2 class="panel__title">장비 상태</h2>
      </div>

      <div class="mini-stats" aria-label="요약">
        <span class="dot dot--ok"></span><span>{{ stats.ok }}</span>
        <span class="dot dot--warn"></span><span>{{ stats.warn }}</span>
        <span class="dot dot--crit"></span><span>{{ stats.crit }}</span>
        <span class="dot dot--unk"></span><span>{{ stats.unk }}</span>
      </div>
    </div>

    <div class="bar" role="img" aria-label="상태 비율 막대">
      <div class="bar__seg bar__seg--unk" :style="{ width: `${stats.pctUnk}%` }"></div>
      <div class="bar__seg bar__seg--ok" :style="{ width: `${stats.pctOk}%` }"></div>
      <div class="bar__seg bar__seg--warn" :style="{ width: `${stats.pctWarn}%` }"></div>
      <div class="bar__seg bar__seg--crit" :style="{ width: `${stats.pctCrit}%` }"></div>
    </div>

    <div class="bar-legend">
      <span>Unknown: <strong>{{ stats.pctUnk }}%</strong></span>
      <span>정상: <strong>{{ stats.pctOk }}%</strong></span>
      <span>센서오류: <strong>{{ stats.pctWarn }}%</strong></span>
      <span>네트워크: <strong>{{ stats.pctCrit }}%</strong></span>
    </div>
  </article>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useDeviceStore } from '@/stores/device'

const deviceStore = useDeviceStore()
const stats = computed(() => deviceStore.deviceStats)

onMounted(() => {
  window.lucide?.createIcons()
})
</script>

<style scoped>
.panel {
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, .10);
  background: rgba(255, 255, 255, .06);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  padding: clamp(10px, 1vw, 12px);
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.panel__head div:first-child {
  display: flex;
  align-items: center;
}

.panel__icon {
  width: 30px;
  height: 30px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: #528ddd;
  border: 1px solid rgba(255, 255, 255, .10);
  margin-right: 10px;
}

.panel__title {
  margin: 0;
  font-size: 15px;
  color: #fff;
  font-weight: 500;
}

.mini-stats {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 900;
  font-size: 14px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.dot--ok {
  background: #27c46b;
}

.dot--caution {
  background: #f7c948;
}

.dot--warn {
  background: #ff9f1a;
}

.dot--crit {
  background: #ff4d4f;
}

.dot--unk {
  background: #9aa7b7;
}

.bar {
  height: 16px;
  border-radius: 999px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, .10);
  background: rgba(0, 0, 0, .20);
  display: flex;
  flex: 0 0 auto;
}

.bar__seg {
  height: 100%;
  transition: width 0.5s ease;
}

.bar__seg--unk {
  background: rgba(154, 167, 183, .75);
}

.bar__seg--ok {
  background: rgba(39, 196, 107, .85);
}

.bar__seg--warn {
  background: rgba(255, 159, 26, .85);
}

.bar__seg--crit {
  background: rgba(255, 77, 79, .85);
}

.bar-legend {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  color: rgba(233, 238, 246, .75);
  font-size: 12px;
  flex: 0 0 auto;
}

/* 모바일 */
@media (max-width: 640px) {
  .panel {
    height: 200px !important;
  }

  .panel__head {
    flex-wrap: wrap;
    gap: 8px;
    align-items: flex-start;
  }

  .mini-stats {
    width: 100%;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 6px 10px;
  }
}
</style>