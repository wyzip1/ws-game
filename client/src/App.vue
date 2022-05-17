<template>
  <div class="container relative overflow-hidden">
    <Login />
    <chat-room class="absolute left bottom width-20vw height-20vw" />
    <SnakeGame v-if="store.state.user.name" :username="store.state.user.name" class="absolute-center" />
  </div>
</template>

<script setup>
import ChatRoom from './components/ChatRoom/index.vue'
import SnakeGame from './components/SnakeGame/index.vue'
import Login from './components/Login/index.vue'
import { useStore } from 'vuex'

const store = useStore()
</script>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
}
</style>
