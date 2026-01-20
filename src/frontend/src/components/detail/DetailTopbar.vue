<template>
  <header class="topbar" role="banner">
    <div class="topbar__inner">
      <!-- 로고 -->
      <div class="brand" aria-hidden="true">
        <div class="brand__logo" aria-label="소하천 통합관제 시스템">
          <a href="/">
            <img src="@/assets/img/logo-sangju.png" alt="로고" />
          </a>
        </div>
      </div>

      <!-- 햄버거 버튼 (모바일) -->
      <v-btn id="menuToggle" class="topbar__menuBtn" variant="text" icon @click="toggleMenu"
        aria-controls="topbarActions" :aria-expanded="menuOpen" aria-label="메뉴">
        <v-icon>mdi-menu</v-icon>
      </v-btn>

      <!-- 메뉴 (드롭다운) -->
      <div class="search__actions" id="topbarActions" :class="{ 'is-open': menuOpen }" role="group" aria-label="바로가기">
        <v-btn variant="text" class="btn-ghost">
          <v-icon class="mr-2">mdi-waves</v-icon>
          <span>수위</span>
        </v-btn>
        <v-btn variant="text" class="btn-ghost">
          <v-icon class="mr-2">mdi-cctv</v-icon>
          <span>CCTV</span>
        </v-btn>
        <v-btn variant="text" class="btn-ghost" @click="goToReport">
          <v-icon class="mr-2">mdi-file-document</v-icon>
          <span>보고서</span>
        </v-btn>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const menuOpen = ref(false)

const toggleMenu = (e) => {
  e.stopPropagation()
  menuOpen.value = !menuOpen.value
}

const closeMenu = (e) => {
  if (menuOpen.value) {
    menuOpen.value = false
  }
}

const goToReport = () => {
  // report 페이지로 이동 (라우트 설정 필요)
  window.location.href = '/report.html'
}

onMounted(() => {
  document.addEventListener('click', closeMenu)
})

onUnmounted(() => {
  document.removeEventListener('click', closeMenu)
})
</script>

<style lang="scss" scoped>
.topbar {
  height: 70px;
  background: linear-gradient(180deg, rgba(36, 68, 98, .9), rgba(50, 78, 109, .65));
  border-bottom: 1px solid rgba(255, 255, 255, .10);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.topbar__inner {
  display: flex;
  width: 100%;
  padding: 0 15px 0 10px;
  gap: 14px;
  align-items: center;
  flex-wrap: nowrap;
  justify-content: space-between;
  height: 100%;
}

.brand {
  flex: 0 0 220px;
  max-width: 300px;
  min-width: 200px;
  flex-shrink: 0;
}

.brand__logo {
  height: 70px;
  display: flex;
  align-items: center;
  padding-left: 10px;
}

.brand__logo img {
  height: 50px;
  width: auto;
  display: block;
}

.topbar__menuBtn {
  display: none !important;
  margin-left: auto;
}

.search__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: nowrap;
  white-space: nowrap;
  margin-left: auto;
  z-index: 20;
}

.search__actions :deep(.v-btn) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 34px;
  min-width: 100px;
  gap: 6px;
  padding: 5px 10px !important;
  border: 1px solid rgba(255, 255, 255, .10);
  border-radius: 5px;
  font-weight: 800;
  font-size: 14px;
  text-transform: none;
  letter-spacing: normal;
}

.search__actions :deep(.v-btn .v-icon) {
  width: 16px;
  height: 16px;
  font-size: 16px;
}

.btn-ghost {
  background: rgba(255, 255, 255, .08) !important;
}

.btn-ghost:hover {
  background: rgba(73, 149, 255, .6) !important;
}

/* 모바일 햄버거 메뉴 */
@media (max-width: 820px) {
  .topbar {
    position: sticky;
    top: 0;
    z-index: 20000;
  }

  .topbar__inner {
    position: relative;
    flex-wrap: wrap;
    z-index: 20001;
  }

  .topbar__menuBtn {
    display: inline-flex !important;
  }

  #topbarActions {
    display: none !important;
    position: fixed !important;
    right: 12px;
    top: calc(70px - 8px);
    z-index: 20002 !important;
    flex-direction: column;
    gap: 8px;
    padding: 10px;
    border-radius: 12px;
    background: rgba(12, 18, 32, .92);
    border: 1px solid rgba(255, 255, 255, .14);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    box-shadow: 0 18px 50px rgba(0, 0, 0, .45);
  }

  #topbarActions.is-open {
    display: flex !important;
  }

  #topbarActions :deep(.v-btn) {
    width: 140px;
    justify-content: flex-start;
  }
}

@media (max-width: 640px) {
  .brand {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
  }

  .brand__logo img {
    height: 32px;
    max-width: 120px;
  }
}
</style>