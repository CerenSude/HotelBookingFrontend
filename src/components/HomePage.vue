<template>
  <div class="home-grid">
    <!-- MAP SIDE -->
    <div class="map-container">
  <button class="map-toggle" @click="showMap = !showMap">
    {{ showMap ? 'Haritayı Gizle' : 'Haritada Göster' }}
  </button>

  <div v-if="showMap" class="map-wrapper">
    <HotelMap :hotels="hotels" />
  </div>
</div>

    <!-- CONTENT SIDE -->
    <div class="content-container">
      <!-- Search Bar -->
      <form class="search-bar" @submit.prevent="searchHotels">
        <div class="search-field">
          <label>📍</label>
          <input type="text" v-model="city" placeholder="Nereye?" />
        </div>
        <div class="search-field">
          <label>📅</label>
          <input type="date" v-model="checkIn" />
        </div>
        <div class="search-field">
          <label>📅</label>
          <input type="date" v-model="checkOut" />
        </div>
        <div class="search-field">
          <label>👤</label>
          <input type="number" v-model="guestCount" min="1" placeholder="Misafir sayısı" />
        </div>
        <button type="submit" class="btn btn-outline">🔍 Ara</button>
      </form>

      <div v-if="hotels.length">
  <router-link
    v-for="hotel in hotels"
    :key="hotel.hotel_id"
    :to="`/hotel/${hotel.hotel_id}`"
    class="hotel-card"
    style="text-decoration: none; color: inherit"
  >
    <!-- LEFT: Image -->
    <div class="card-left">
      <img v-if="hotel.image_url" :src="hotel.image_url" alt="otel resmi" class="hotel-image" />
      <button class="favorite-btn" @click.stop.prevent>♡</button>
    </div>

    <!-- RIGHT: Details -->
    <div class="card-right">
      <div class="hotel-title">
        <h3>{{ hotel.name }}</h3>
        <p>{{ hotel.city }}</p>
      </div>

      <div class="amenities">
        <span v-for="amenity in hotel.amenities.slice(0, 5)" :key="amenity">
          {{ amenityIcons[amenity] || '•' }} {{ amenity }}
        </span>
      </div>

      <div class="rating-price">
        <div class="rating-box" :class="ratingInfo(hotel.rating).class">
          <span>{{ hotel.rating.toFixed(1) }}</span>
          <p>
            <strong>{{ ratingInfo(hotel.rating).text }}</strong><br />
            {{ hotel.comment_count }} yorum
          </p>
        </div>

        <div class="price-box">
          <div v-if="user && hotel.discount">
            <span class="discount-label">%{{ hotel.discount }} indirim</span><br />
            <span class="old-price">
              {{ (hotel.price + hotel.price * hotel.discount / 100).toFixed(0) }} TL
            </span>
            <span class="actual-price">{{ hotel.price.toFixed(0) }} TL</span>
          </div>

          <div v-else-if="!user && hotel.flagged">
            <span class="member-price-msg">Üye fiyatı için giriş yapın</span><br />
            <span class="actual-price">
              {{ (hotel.price + hotel.price * hotel.discount / 100).toFixed(0) }} TL
            </span>
          </div>

          <div v-else>
            <span class="actual-price">{{ hotel.price.toFixed(0) }} TL</span>
          </div>

          <small>1 gece için vergiler dahil</small>
        </div>
      </div>
    </div>
  </router-link>
</div>

      <div v-else>
        <p>Gösterilecek otel bulunamadı.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import HotelMap from './HotelMap.vue'
import { ref, onMounted } from 'vue'
import { user } from '../stores/user'

const showMap = ref(false)
const city = ref('')
const checkIn = ref('')
const checkOut = ref('')
const guestCount = ref(1)
const hotels = ref([])
const amenityIcons = {
  "Havuz": "🏊",
  "Kahvaltı dahil": "🍳",
  "WiFi": "📶",
  "Spa": "🧖",
  "Deniz manzarası": "🌊",
  "Otopark": "🚗",
  "Şömine": "🔥",
  "Doğa yürüyüşü rotaları": "🥾",
  "Evcil hayvan kabul edilir": "🐾",
  "Restoran": "🍽️",
  "Bar": "🍸",
  "Sahil erişimi": "🏖️",
  "Klima": "❄️"
}

function ratingInfo(score) {
  if (score >= 9) return { text: "Harika", class: "rating-harika" }
  if (score >= 7) return { text: "Mükemmel", class: "rating-mukemmel" }
  if (score >= 6) return { text: "İyi", class: "rating-iyi" }
  return { text: "Fena değil", class: "rating-fena" }
}


function loadAllHotels() {
  fetch('http://localhost:5000/hotels')
    .then(res => res.json())
    .then(data => hotels.value = data)
    .catch(err => console.error("Tüm oteller alınamadı:", err))
}

function searchHotels() {
  const url = new URL('http://localhost:5000/hotels/search')
  if (city.value) url.searchParams.append("city", city.value)
  if (guestCount.value) url.searchParams.append("guests", guestCount.value)
  if (checkIn.value) url.searchParams.append("checkIn", checkIn.value)
  if (checkOut.value) url.searchParams.append("checkOut", checkOut.value)

  fetch(url)
    .then(res => res.json())
    .then(data => hotels.value = data)
    .catch(err => console.error("Filtreli arama hatası:", err))
}

onMounted(() => {
  loadAllHotels()
})

</script>

<style scoped>
form {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.home-grid {
  display: grid;
  grid-template-columns: 30% 70%;
  gap: 1rem;
  margin-top: 1rem;
  
}

.map-container {
  background-color: #f4e7d8; 
  border-radius: 8px;
  padding: 1rem;
  width: 100%;
  max-height: 40%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.map-toggle {
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;       
  border-radius: 8px;          
  font-weight: bold;
  cursor: pointer;
  border: none;
  background-color: #6a1b9a;
  color: white;
  transition: background-color 0.2s ease;
}

.map-toggle:hover {
  background-color: #4a0072;
}

.map-wrapper {
  height: 700px; 
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.content-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn {
  background-color: #6a1b9a;
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  transition: background-color 0.2s ease;
  border: none; /* Butonlar genelde border yok */
  cursor: pointer;
}

.btn:hover {
  background-color: #4a0072;
}

.btn-outline {
  padding: 0.6rem 1.2rem;
  font-weight: 600;
  border-radius: 8px;
  border: 2px solid #6a1b9a;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-outline:hover {
  background-color: #6a1b9a;
  color: white;
}

.hotel-card {
  display: flex;
  border: 1px solid #ddd;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
  background-color: #fff;
  transition: transform 0.2s ease;
  max-height: 220px;
}

.card-left {
  width: 250px;
  height: 100%;
  position: relative;
  flex-shrink: 0;
}

.hotel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.favorite-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: white;
  border: none;
  font-size: 18px;
  border-radius: 50%;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  cursor: pointer;
}

.card-right {
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
}

.hotel-title h3 {
  margin: 0;
  font-size: 1.2rem;
}
.hotel-title p {
  color: #666;
  margin: 0.25rem 0 0.5rem;
}

.amenities {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.rating-price {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.rating-box span {
  padding: 0.3rem 0.6rem;
  font-weight: bold;
  border-radius: 6px;
  font-size: 0.9rem;
  color: white; 
  background-color: #4caf50; 
}

.rating-harika span {
  background-color: #4caf50; 
  color: white;
}

.rating-mukemmel span {
  background-color: #fbc02d; 
  color: black;
}

.rating-iyi span {
  background-color: #ffb300; 
  color: black;
}

.rating-fena span {
  background-color: #d32f2f; 
  color: white;
}

.price-box {
  text-align: right;
}

.discount-label {
  background-color: #d32f2f;
  color: white;
  padding: 0.25rem 0.5rem;
  font-size: 0.85rem;
  border-radius: 4px;
  margin-bottom: 0.25rem;
  display: inline-block;
}

.old-price {
  text-decoration: line-through;
  color: #888;
  font-size: 0.9rem;
  margin-right: 0.3rem;
}

.actual-price {
  font-size: 1.2rem;
  font-weight: bold;
  color: #222;
}

.member-price-msg {
  color: #0071c2;
  font-weight: bold;
  font-size: 0.95rem;
}
.content-container {
  padding-right: 1rem;
}

input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  -moz-appearance: none;    
  appearance: none;        
  margin: 0; 
}

input[type=number] {
  -webkit-appearance: textfield; 
  -moz-appearance: textfield;    
  appearance: textfield;          
}

.search-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  align-items: center; 

.search-field {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f9f9f9;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  flex: 1 1 150px; 
  min-width: 150px;
  transition: border-color 0.3s ease;
}

.search-field:focus-within {
  border-color: #6a1b9a;
  box-shadow: 0 0 5px #6a1b9a;
}

.search-field label {
  font-size: 1.2rem;
  user-select: none;
}

.search-field input[type="text"],
.search-field input[type="date"],
.search-field input[type="number"] {
  border: none;
  background: transparent;
  outline: none;
  font-size: 1rem;
  flex-grow: 1;
  padding: 0.4rem 0;
  font-family: inherit;
  color: #333;
}

.search-field input[type="number"]::-webkit-inner-spin-button,
.search-field input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
@media (max-width: 768px) {
  .home-grid {
    grid-template-columns: 1fr;
  }

  .hotel-card {
    flex-direction: column;
    max-height: none;
  }

  .card-left {
    width: 100%;
    height: 200px;
  }

  .rating-price {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .price-box {
    text-align: left;
  }

  .l-map {
  height: 100% !important;
  width: 100% !important;
  min-height: 250px !important;
  }
  .map-wrapper {
    height: 300px !important;
  }

  .map-container {
    padding: 0.5rem;
    background-color: #f4e7d8;
    max-height: 100%;
  }

  .map-toggle {
    font-size: 1rem;
    width: 100%;
  }
 
  .search-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .search-bar input,
  .search-bar button {
    width: 100%;
  }
}
}
</style>