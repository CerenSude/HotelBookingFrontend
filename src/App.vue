<template>
  <div id="app">
    <HeaderBar />
    <router-view />
  </div>
</template>

<script setup>
import HeaderBar from './components/HeaderBar.vue'

</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
  background-color: #fdf6ff;
  min-height: 100vh;
}

</style>
