<template>
  <div class="container">
    <Login v-if="!user.name" />
    <div v-else class="userInfo">
      用户名称：{{user.name}}
      <button @click="logout">退出登陆</button>
    </div>
    <chat-room />
  </div>
</template>

<script setup>
import ChatRoom from './components/ChatRoom/index.vue'
import Login from './components/Login/index.vue'
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const user = computed(() => store.state.user)

function logout() {
  store.commit('logout')
}
</script>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-top: 8vh;
  box-sizing: border-box;
}

.userInfo {
  width: 200px;
  height: 60px;
  background-color: rgb(242, 242, 242);
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  transform: translateY(-10px);
}
</style>

<style>
* {
  margin: 0;
  padding: 0;
}
</style>
