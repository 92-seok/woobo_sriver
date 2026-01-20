import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import './style.postcss'
import './assets/style/main-style.css'
import './assets/style/detail.css'


createApp(App).use(createPinia()).use(router).use(vuetify).mount('#app')
