<template>
  <section class="bottom">
    <!-- 장비 상태 -->
    <StatusBar />

    <!-- 상태 안내 -->
    <StatusLegend />
  </section>
</template>

<script setup>
import StatusBar from './StatusBar.vue'
import StatusLegend from './StatusLegend.vue'
</script>

<style scoped></style>
