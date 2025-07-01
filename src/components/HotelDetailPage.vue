<template>
  <!-- Hotel bilgisi ve adı gelmeden hiçbir şey render etme -->
  <div class="hotel-detail-wrapper" v-if="hotel && hotel.name">
    <!-- ÜST KISIM: Resim + Temel Bilgi -->
    <div class="hotel-main">
  <!-- SOL: Otel bilgileri -->
  <div class="hotel-info-container">
    <img :src="hotel.image_url" alt="Otel görseli" class="hotel-image" />
    <h2>{{ hotel.name }}</h2>
    <p class="location">{{ hotel.city }}, {{ hotel.country }}</p>
    <p class="rating">⭐ {{ hotel.rating }} - {{ hotel.num_comments }} yorum</p>
    <button class="toggle-comments" @click="toggleComments">
      {{ showDetails ? 'Yorumları gizle' : `${hotel.num_comments} yorumun tümünü göster` }}
    </button>

    <div class="amenities">
      <strong>Popüler Özellikler:</strong>
      <ul>
        <li v-for="a in hotel.amenities" :key="a">
          {{ amenityIcons[a] || '•' }} {{ a }}
        </li>
      </ul>
    </div>

    <!-- Fiyat Bilgisi -->
    <div class="price-box" v-if="hotel && hotel.price !== undefined">
      <div v-if="user && hotel.discount">
        <span class="discount-label">%{{ hotel.discount }} indirim</span><br />
        <span class="old-price">{{ (hotel.price + hotel.price * hotel.discount / 100).toFixed(0) }} TL</span>
        <span class="actual-price">{{ hotel.price.toFixed(0) }} TL</span>
      </div>
      <div v-else-if="!user && hotel.flagged">
        <span class="member-price-msg">Üye fiyatı için giriş yapın</span><br />
        <span class="actual-price">{{ (hotel.price + hotel.price * hotel.discount / 100).toFixed(0) }} TL</span>
      </div>
      <div v-else>
        <span class="actual-price">{{ hotel.price.toFixed(0) }} TL</span>
      </div>
      <small>1 gece için vergiler dahil</small>
    </div>
  </div>

  <!-- SAĞ: Harita -->
  <div class="map-container">
    <HotelMap :hotels="[hotel]" />
  </div>
</div>

    
    <!-- ALT KISIM: Yorumlar ve Grafik -->
    <div class="bottom-section" v-if="showDetails" ref="commentSection">

      <!-- Yorumlar -->
      <div class="comments" v-if="hotel.comments && hotel.comments.length">
        <h3>Kullanıcı Yorumları</h3>
        <div v-for="comment in hotel.comments" :key="comment.comment_id" class="comment-card">
          <p class="comment-rating">⭐ {{ comment.rating }}</p>
          <p class="comment-text">"{{ comment.comment_text }}"</p>
          <p class="comment-user">
            {{ getFlag(comment.user_country) }} {{ comment.user_name }}
          </p>
        </div>
      </div>

      <!-- Grafik -->
      <div class="rating-chart" v-if="chartData">
        <h3>Hizmete Göre Puan Dağılımı</h3>
          <Bar :data="chartData" :options="chartOptions" />
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { Bar } from 'vue-chartjs'
import { user } from '../stores/user'
import HotelMap from './HotelMap.vue'
import {
  Chart,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

Chart.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const route = useRoute()
const hotel = ref(null)
const chartData = ref(null)
function getFlag(country) {
  const code = {
    Türkiye: '🇹🇷',
    Almanya: '🇩🇪',
    Fransa: '🇫🇷'
  }
  return code[country] || '🏳️'
}
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
const showDetails = ref(false)
const commentSection = ref(null)

function toggleComments() {
  showDetails.value = !showDetails.value

  nextTick(() => {
    if (showDetails.value && commentSection.value) {
      commentSection.value.scrollIntoView({ behavior: 'smooth' })
    }
  })
}
onMounted(async () => {
  const hotelId = route.params.id

  try {
    const res = await fetch(`http://localhost:5000/hotels/${hotelId}`)
    const data = await res.json()
    hotel.value = data

    if (data.comments && data.comments.length) {
      const grouped = data.comments.reduce((acc, comment) => {
        if (!acc[comment.service_name]) acc[comment.service_name] = []
        acc[comment.service_name].push(comment.rating)
        return acc
      }, {})

      const labels = Object.keys(grouped)
      const averages = labels.map(service => {
        const total = grouped[service].reduce((sum, val) => sum + val, 0)
        return (total / grouped[service].length).toFixed(1)
      })

      chartData.value = {
        labels,
        datasets: [
          {
            label: 'Puan',
            data: averages,
            backgroundColor: '#0071c2'
          }
        ]
      }
    }
  } catch (err) {
    console.error('Detaylar alınamadı:', err)
  }
})

const chartOptions = {
  indexAxis: 'y',
  scales: {
    x: {
      beginAtZero: true,
      max: 10
    }
  }
}
</script>

<style scoped>
.hotel-detail-wrapper {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 1rem;
}

.hotel-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  flex-wrap: wrap;
}

.hotel-info-container {
  flex: 1.5;
  min-width: 500px;
}

.hotel-image {
  width: 100%;
  height: auto;
  max-width: 400px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.location {
  color: #666;
}

.rating {
  margin: 0.5rem 0;
  font-size: 1.1rem;
}

.amenities ul {
  padding-left: 1rem;
  margin-top: 0.5rem;
}

.old-price {
  text-decoration: line-through;
  color: #888;
  margin-right: 8px;
}

.actual-price {
  font-size: 1.3rem;
  font-weight: bold;
  color: #222;
}

.discount-label {
  background-color: #d32f2f;
  color: white;
  padding: 0.25rem 0.5rem;
  font-size: 0.85rem;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  display: inline-block;
}

.member-price-msg {
  color: #0071c2;
  font-weight: bold;
  font-size: 0.95rem;
}

.map-container {
  flex: 1;
  min-width: 300px;
  height: 350px;
  box-sizing: border-box;
  background-color: #d0e6ff;
  border-radius: 8px;
  padding: 1rem;
}

.map-wrapper,
.l-map {
  height: 100% !important;
  width: 100% !important;
  min-height: 250px;
  display: block;
}

.rating-chart {
  margin-top: 3rem;
}

.bottom-section {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  margin-top: 3rem;
  flex-wrap: wrap;
}

.toggle-comments {
  margin-top: 0.5rem;
  background-color: transparent;
  color: #0071c2;
  border: none;
  font-weight: bold;
  cursor: pointer;
  font-size: 0.95rem;
}
.toggle-comments:hover {
  text-decoration: underline;
}

.comments, .rating-chart {
  flex: 1;
  min-width: 300px;
}

.comments {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
}

.comment-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  background-color: #f9f9f9;
  font-size: 0.95rem;
  max-width: 100%;
}

.comment-rating {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.comment-text {
  font-style: italic;
  margin-bottom: 0.25rem;
}

.comment-user {
  font-size: 0.9rem;
  color: #444;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

@media (max-width: 768px) {
  .hotel-main {
    flex-direction: column;
    align-items: stretch;
  }

  .hotel-info-container {
    width: 100%;
  }

  .hotel-image {
    max-width: 100%;
    height: auto;
  }
  .map-container {
    width: 100%;
    height: 300px !important;
    min-height: 300px !important;
    padding: 0.5rem;
    display: block !important;
  }
  .map-wrapper,
  .l-map {
    height: 100% !important;
    width: 100% !important;
    min-height: 250px !important;
    display: block !important;
  }

  .bottom-section {
    flex-direction: column;
  }

  .comment-card {
    font-size: 0.9rem;
    padding: 0.5rem 0.75rem;
  }

  .comment-text {
    font-size: 0.95rem;
  }
}
</style>

