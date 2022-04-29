<template>
  <div class="login absolute-center" v-if="!store.state.user.name">
    <w-input v-model="username" @keydown.enter="doLogin" placeholder="请输入你的名称" />
    <w-button primary @click="doLogin">登陆</w-button>
  </div>
  <div v-else class="userInfo width-20vw absolute left left top top">
      用户名称：{{store.state.user.name}}
      <w-button type="danger" @click="logout">退出登陆</w-button>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "vuex";
import wInput from "../UI/w-input.vue";
import wButton from "../UI/w-button.vue";

const store = useStore()
const username = ref('')

function doLogin() {
  store.commit('login', { name: username.value })
  username.value = ''
}

function logout() {
  store.commit('logout')
}

</script>

<style scoped>
.login {
  width: 240px;
  border: 1px solid #e7e7e7;
  display: flex;
  justify-content: center;
  column-gap: 10px;
  padding: 15px 30px;
}

.userInfo {
  min-width: 360px;
  padding: 12px 16px;
  background-color: rgb(242, 242, 242);
  display: flex;
  justify-content: space-between;
  column-gap: 10px;
  align-items: center;
  font-size: 14px;
  white-space: nowrap;
  box-sizing: border-box;
}
</style>
