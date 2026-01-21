  <template>
    <article class="panel" aria-label="상태 안내">
      <div class="panel__head">
        <div>
          <span class="panel__icon" aria-hidden="true">
            <i data-lucide="alert-circle" class="btn__icon"></i>
          </span>
          <h2 class="panel__title">상태 안내</h2>
        </div>
      </div>

      <div class="legend">
        <ul>
          <li>
            <span class="dot dot--ok"></span>
            정상: 통신/센서 정상
          </li>
          <li>
            <span class="dot dot--caution"></span>
            센서오류: 값 오류
          </li>
          <li>
            <span class="dot dot--crit"></span>
            네트워크: 통신 실패
          </li>
          <li>
            <span class="dot dot--unk"></span>
            Unknown: 수신 없음
          </li>
        </ul>
      </div>
    </article>
  </template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  window.lucide?.createIcons()
})
</script>

<style scoped></style>