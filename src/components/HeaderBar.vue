headerbar

<template>
  <header class="top-bar">
    <div class="logo">
      <img :src="Logo" alt="Logo" class="logo-img" />
      <router-link to="/" class="logo-text">HotelBooking</router-link>
    </div>

    <div class="right-buttons">
      <!-- Kullanıcı Girişi kısmı -->
      <template v-if="user">
        <img v-if="user.photo" :src="user.photo" class="profile-img" />
        <span v-if="user">{{ welcomeText }}, {{ user.name }}</span>
        <button @click="logoutUser" class="btn btn-outline">{{ logoutText }}</button>
      </template>
      <template v-else>
        <router-link to="/login" class="btn btn-outline" :exact="true">{{ loginText }}</router-link>
        <router-link to="/register" class="btn btn-outline">{{ registerText }}</router-link>
        <!-- Dil değiştirme butonları -->
      <button class="btn btn-outline" @click="changeLang('tr')" :disabled="lang==='tr'">TR</button>
      <button class="btn btn-outline" @click="changeLang('en')" :disabled="lang==='en'">EN</button>
      </template>
    </div>
  </header>
</template>


<script setup>
import Logo from '@/assets/HotelBookingLogo.png'
import { user } from '@/stores/user'
import { useRouter } from 'vue-router'
import { useLangStore } from '@/stores/langstore'
import { computed } from 'vue'

const router = useRouter()
const langStore = useLangStore()

const lang = computed(() => langStore.lang)

function changeLang(newLang) {
  langStore.setLang(newLang)
}

const welcomeText = computed(() => lang.value === 'tr' ? 'Merhaba' : 'Welcome')
const logoutText = computed(() => lang.value === 'tr' ? 'Çıkış Yap' : 'Logout')
const loginText = computed(() => lang.value === 'tr' ? 'Giriş Yap' : 'Login')
const registerText = computed(() => lang.value === 'tr' ? 'Kayıt Ol' : 'Register')

function logoutUser() {
  localStorage.removeItem('user')
  user.value = null
  router.push('/')
}
</script>

<style scoped>

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #f4e7d8; 
  box-shadow: 0 2px 8px rgba(100, 0, 150, 0.1);
}

.logo {
  display: flex;
  align-items: center;
}

.logo-img {
  height: 32px;
  margin-right: 0.5rem;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: bold;
  color: #6a1b9a;
  text-decoration: none;
}

.profile-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: -0.5rem;
  border: 2px solid #6a1b9a;
}

.right-buttons {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.welcome-msg {
  font-weight: 700;
  color: #6a1b9a;
}

.btn {
  background-color: #6a1b9a;
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.btn:hover {
  background-color: #4a0072;
}

.btn-outline {
  background-color: transparent;
  border: 1px solid #6a1b9a;
  color: #6a1b9a;
}

.btn-outline:hover {
  background-color: #6a1b9a;
  color: white;
}

.router-link-active.btn,
.router-link-exact-active.btn {
  background-color: #6a1b9a; /* or your default */
  color: white;
  box-shadow: none;
  transform: none;
}
</style>
