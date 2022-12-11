import { createApp } from 'vue'
import { createPinia } from 'pinia'
import registerPlugins from '@/libs/plugins/index'
import router from './router'
import App from './App.vue'

const app = createApp(App)

app.use(router).use(createPinia()).use(registerPlugins())

app.mount('#app')
