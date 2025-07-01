<template>
  <div>
    <h3>Flask API Test:</h3>
    <p>{{ message }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: 'Loading...'
    }
  },
  mounted() {
    fetch('http://localhost:5000/ping')
      .then(res => res.json())
      .then(data => {
        this.message = data.message
      })
      .catch(err => {
        this.message = 'Error connecting to backend 😢'
        console.error(err)
      })
  }
}
</script>
