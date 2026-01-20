<template>
  <div class="main-page">
    <!-- 스킵 링크 -->
    <a class="skip-link" href="#main">본문 바로가기</a>

    <!-- 상단 바 -->
    <TopBar />

    <main id="main" class="layout">
      <!-- 지도 -->
      <MapSection />

      <!-- 우측 사이드바 -->
      <DeviceSidebar />

      <!-- 하단 패널 -->
      <BottomPanel />
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import TopBar from '@/components/main/TopBar.vue'
import MapSection from '@/components/main/MapSection.vue'
import DeviceSidebar from '@/components/main/DeviceSidebar.vue'
import BottomPanel from '@/components/main/BottomPanel.vue'

onMounted(() => {
  // 아이콘 초기화 필요시 사용
})

</script>

<style lang="scss" scoped>
@import '@/assets/style/main-style.css';

.main-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  // background: #0b1424;
}
</style>