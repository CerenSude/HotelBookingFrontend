import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import GoogleLogin from 'vue3-google-login'
import 'leaflet/dist/leaflet.css'

const app = createApp(App)

app.use(router)
app.use(GoogleLogin, {
  clientId: '1060961589899-55jitoneii4mcof5dupuq11buh6naa18.apps.googleusercontent.com'
})

app.mount('#app')