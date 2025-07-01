<template>
  <div class="login-form">
    <h2>Giriş Yap</h2>

    <form @submit.prevent="handleLogin">
      <label>Email</label>
      <input type="email" v-model="email" required />

      <label>Şifre</label>
      <input type="password" v-model="password" required />

      <button type="submit">Giriş Yap</button>
    </form>

    <p v-if="errorMessage" style="color: #e53935">{{ errorMessage }}</p>
    <p v-if="successMessage" style="color: #2e7d32">{{ successMessage }}</p>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import axios from 'axios'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const successMessage = ref('')

const handleLogin = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const response = await axios.post('http://localhost:5000/login', {
      email: email.value,
      password: password.value,
    })

    successMessage.value = response.data.message

    localStorage.setItem('user', JSON.stringify({
      name: response.data.name,
      email: response.data.email,
      id: response.data.id,  
      photo: response.data.id ? `http://localhost:5000/user-photo/${response.data.id}` : null
    }))

    setTimeout(() => {
      window.location.href = '/'
    }, 500)

  } catch (err) {
    if (err.response?.data?.error) {
      errorMessage.value = err.response.data.error
    } else {
      errorMessage.value = 'Giriş sırasında hata oluştu.'
    }
  }
}
</script>

<style scoped>
form {
  background-color: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

input, select {
  padding: 0.75rem 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s ease;
}
input:focus, select:focus {
  border-color: #0071c2;
}

button {
  background-color: #0071c2;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s ease;
}
button:hover {
  background-color: #005b9f;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 1rem;
}

label {
  font-weight: 500;
  color: #333;
}

</style>
