import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '@/pages/MainPage.vue'
import DetailPage from '@/pages/DetailPage.vue'

const routes = [
  {
    path: '/',
    name: 'Main',
    component: MainPage,
    meta: { title: '소하천 통합관제 시스템' },
  },
  {
    path: '/detail/:id',
    name: 'Detail',
    component: DetailPage,
    meta: { title: '소하천 상세보기' },
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '소하천 통합관제 시스템'
  next()
})

export default router