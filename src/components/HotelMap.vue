<template>
  <div class="map-wrapper">
    <l-map
      ref="leaflet"
      :zoom="6"
      :center="[latitude, longitude]"
      style="height: 100%; width: 100%"
    >
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <l-marker
        v-for="hotel in hotels"
        :key="hotel.hotel_id"
        :lat-lng="[hotel.latitude, hotel.longitude]"
      >
        <l-popup>
          <strong>{{ hotel.name }}</strong><br />
          {{ hotel.city }}<br />
          {{ hotel.price }} TL
        </l-popup>
      </l-marker>
    </l-map>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick, onUpdated } from 'vue'
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet'
import 'leaflet/dist/leaflet.css'

const props = defineProps({
  hotels: Array
})

const mapRef = ref(null)

const latitude = ref(38.4237)
const longitude = ref(27.1428)

onMounted(() => {
  nextTick(() => {
    const leafletMap = mapRef.value?.leafletObject
    if (leafletMap?.invalidateSize) {
      leafletMap.invalidateSize()
    }
  })
})

const leaflet = ref(null)

onUpdated(() => {
  nextTick(() => {
    leaflet.value?.leafletObject?.invalidateSize?.()
  })
})

watch(
  () => props.hotels,
  (newHotels) => {
    if (Array.isArray(newHotels) && newHotels.length > 0) {
      const firstHotel = newHotels[0]
      if (firstHotel.latitude && firstHotel.longitude) {
        latitude.value = firstHotel.latitude
        longitude.value = firstHotel.longitude
      }
    }
  },
  { immediate: true, deep: true }
)
</script>

<style scoped>
.map-wrapper {
  width: 100%;
  height: 100%;
  min-height: 300px;
  position: relative;
}

.l-map {
  height: 100% !important;
  width: 100% !important;
  min-height: 300px !important;
  display: block !important;
}
</style>
