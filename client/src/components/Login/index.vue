<template>
  <div class="login">
    <input type="text" v-model="username" >
    <button @click="doLogin">登陆</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "vuex";

const store = useStore()
const username = ref('')

function doLogin() {
  store.commit('login', { name: username.value })
}

</script>

<style scoped>
.login {
  width: 240px;
  border: 1px solid #e7e7e7;
  display: flex;
  justify-content: center;
  column-gap: 10px;
  padding: 15px 0;
}
</style>
