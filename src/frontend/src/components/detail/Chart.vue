<template>
  <section class="sub-panel water-grid">
    <div class="sub-panel-hd">
      <div>수위 변화량(72시간)</div>
      <small>• 최근 72시간 수위 변화 없음</small>
    </div>
    <div class="sub-panel-bd">
      <div class="chart-container">
        <Line :data="chartData" :options="chartOptions" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const props = defineProps({
  device: {
    type: Object,
    default: () => ({})
  }
})

// 72시간 라벨 생성
const makeTimeLabels = (hours = 72) => {
  const labels = []
  const now = new Date()
  for (let i = hours; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 60 * 60 * 1000)
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    const hh = String(d.getHours()).padStart(2, '0')
    labels.push(`${mm}/${dd} ${hh}:00`)
  }
  return labels
}

const labels = makeTimeLabels(72)
const baseFL = 55.198

const chartData = computed(() => {
  const wlSeries = labels.map(
    (_, i) => baseFL + Math.sin(i / 14) * 0.01 + (Math.random() * 0.004 - 0.002)
  )
  const velSeries = labels.map(
    (_, i) => 0.12 + Math.max(0, Math.sin(i / 6)) * 0.08 + Math.random() * 0.03
  )

  return {
    labels,
    datasets: [
      {
        label: '수위 (m)',
        data: wlSeries,
        tension: 0.25,
        pointRadius: 0,
        borderWidth: 2,
        borderColor: '#4ea0ff',
        backgroundColor: 'rgba(78, 160, 255, 0.1)'
      },
      {
        label: '평균 유속 (m/s)',
        data: velSeries,
        tension: 0.15,
        pointRadius: 2,
        borderWidth: 1,
        borderColor: '#27c46b',
        backgroundColor: 'rgba(39, 196, 107, 0.1)',
        yAxisID: 'y2'
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { color: 'rgba(235,245,255,.85)', font: { weight: '700' } }
    },
    tooltip: { mode: 'index', intersect: false }
  },
  interaction: { mode: 'index', intersect: false },
  scales: {
    x: {
      ticks: {
        color: 'rgba(235,245,255,.65)',
        maxRotation: 45,
        minRotation: 45,
        autoSkip: true,
        maxTicksLimit: 10
      },
      grid: { color: 'rgba(255,255,255,.08)' }
    },
    y: {
      position: 'left',
      ticks: { color: 'rgba(235,245,255,.65)' },
      grid: { color: 'rgba(255,255,255,.08)' }
    },
    y2: {
      position: 'right',
      ticks: { color: 'rgba(235,245,255,.65)' },
      grid: { drawOnChartArea: false }
    }
  }
}
</script>

<style lang="scss"></style>