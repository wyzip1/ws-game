<template>
  <div class="container relative overflow-hidden">
    <Login />
    <chat-room class="absolute left bottom width-20vw height-20vw" />
  </div>
</template>

<script setup>
import ChatRoom from './components/ChatRoom/index.vue'
import Login from './components/Login/index.vue'
</script>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
}
</style>
