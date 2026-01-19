<template>
  <section class="netbar panel panel--network">
    <div class="fw-black" style="font-weight: 900">네트워크 정보</div>
    <div>
      <div class="net-chip">
        Public IP <b>{{ publicIp }}</b>
      </div>
      <div class="net-chip ml-10">
        Gateway IP <b>{{ gatewayIp }}</b>
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

const publicIp = computed(() => props.device?.publicIp || '211.171.24.186')
const gatewayIp = computed(() => props.device?.gatewayIp || '211.171.24.185')
</script>

<style lang="scss" scoped></style>