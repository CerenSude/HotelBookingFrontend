<template>
  <div class="register-form">
    <h2>Kayıt Ol</h2>

    <form @submit.prevent="handleRegister">
      <label>Ad Soyad</label>
      <input type="text" v-model="form.name" required />
      <label>Email</label>
      <input type="email" v-model="form.email" required />

      <label>Şifre</label>
      <input type="password" v-model="form.password" required />

      <label>Şifre Tekrar</label>
      <input type="password" v-model="form.password2" required />

      <label>Ülke</label>
      <select v-model="form.country" required>
        <option disabled value="">Lütfen ülke seçin</option>
        <option>Türkiye</option>
        <option>Almanya</option>
        <option>Fransa</option>
      </select>

      <label>Şehir</label>
      <select v-model="form.city" required>
        <option disabled value="">Lütfen şehir seçin</option>
        <option>İzmir</option>
        <option>İstanbul</option>
        <option>Ankara</option>
      </select>

      <label>Fotoğraf (PNG)</label>
      <input type="file" accept="image/png" @change="handleFileUpload" />


      <button type="submit">Kayıt Ol</button>
    </form>

    <p v-if="errorMessage" style="color: #e53935">{{ errorMessage }}</p>
    <p v-if="successMessage" style="color: #2e7d32">{{ successMessage }}</p>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import axios from 'axios'

const form = ref({
  name: '',
  email: '',
  password: '',
  password2: '',
  country: '',
  city: '',
})
const selectedFile = ref(null)
const errorMessage = ref('')
const successMessage = ref('')

const handleFileUpload = (event) => {
  selectedFile.value = event.target.files[0]
}

const handleRegister = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (form.value.password !== form.value.password2) {
    errorMessage.value = 'Şifreler uyuşmuyor.'
    return
  }

  const formData = new FormData()
  for (const key in form.value) {
    formData.append(key, form.value[key])
  }

  if (selectedFile.value) {
    formData.append('photo', selectedFile.value)
  }

  try {
    const response = await axios.post('http://localhost:5000/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    successMessage.value = response.data.message

    localStorage.setItem('user', JSON.stringify({
      name: form.value.name,
      email: form.value.email,
      id: response.data.id,
      photo:  `http://localhost:5000/user-photo/${response.data.id}`
    }))

  } catch (err) {
    if (err.response?.data?.error) {
      errorMessage.value = err.response.data.error
    } else {
      errorMessage.value = 'Kayıt sırasında hata oluştu.'
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
