import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        colors: {
          primary: '#4ea0ff',
          secondary: '#528ddd',
          background: '#0b1424',
          surface: 'rgba(20, 54, 90, 0.55)',
          ok: '#27c46b',
          caution: '#f7c948',
          warn: '#ff9f1a',
          crit: '#ff4d4f',
          unk: '#9aa7b7',
        },
      },
    },
  },
  defaults: {
    VBtn: {
      style: 'text-transform: none;',
    },
  },
})