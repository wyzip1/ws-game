<template>
  <div v-if="user.name" class="chatroom">
    <div class="infoList" ref="infoListEl">
      <div v-for="(info, index) in infoList" :key="index">
      <div class="tip" v-if="info.type === 'tip'">
        <span>{{info.info}}</span>
      </div>
      <div v-else-if="info.type === 'msg'" :class="{'msg-content': true, self: info.self}">
        <div class="user">{{info.info.user}}</div>
        <div class="msg">{{info.info.data}}</div>
      </div>
    </div>
    </div>
    <div class="input-msg">
      <input type="text" v-model="inputMsg" @keydown.enter="send">
      <button @click="send">发送</button>
    </div>
  </div>
  <div v-else style="margin-top: 10px">
    请登录
  </div>
</template>

<script setup>
import { computed, ref, watch, nextTick } from 'vue'
import { useStore } from 'vuex'

const user = computed(() => store.state.user)
const ws = ref()
const infoList = ref([])
const inputMsg = ref('')
const infoListEl = ref();
const store = useStore()

window.infoList = infoListEl

// 根据用户状态创建WebSocket
watch(user, () => {
  if(!user.value.name) {
    ws.value && ws.value.close()
    return;
  }
  const WS = new WebSocket('ws://localhost:8085/chatroom?name=' + user.value.name)
  WS.onmessage = (res) => {
    const data = JSON.parse(res.data)
    infoList.value.push(data)
    const {scrollHeight, clientHeight, scrollTop} = infoListEl.value
    console.log(scrollHeight, clientHeight, scrollTop);
    if((scrollHeight - clientHeight) - scrollTop < 5) nextTick(() => resetBottom())
  }
  
  ws.value = WS
}, { immediate: true })

function send() {
  if(inputMsg.value.trim() === '') return;
  ws.value.send(inputMsg.value)
  infoList.value.push({ type: 'msg', info: { data: inputMsg.value, user: user.value.name }, self: true })
  inputMsg.value = ''
  nextTick(() => {
    resetBottom();
  })
}

function resetBottom() {
  const {scrollHeight, clientHeight} = infoListEl.value
  infoListEl.value.scrollTo({
    top: scrollHeight - clientHeight,
    behavior: "smooth"
  })
}

</script>

<style scoped>
.chatroom {
  max-width: 1000px;
  width: 85vw;
  height: 70vh;
  box-shadow: 0 0 5px 1px #00000033;
  display: flex;
  flex-direction: column;
  padding: 10px 12px 0;
  box-sizing: border-box;
}

.infoList {
  flex-shrink: 1;
  flex-grow: 1;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  row-gap: 10px;
  flex-direction: column;
  padding-bottom: 10px;
}

.tip {
  text-align: center;
}

.tip span {
  display: inline-block;
  padding: 5px 10px;
  background-color: #e7e7e7;
  border-radius: 20px;
  font-size: 12px;
  color: #a0a0a0;
}

.input-msg {
  height: 40px;
  min-height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  column-gap: 10px;
  border-top: 1px solid #E7E7E7;
}

.msg-content {
  width: 100%;
  display: flex;
  align-items: flex-start;
  font-size: 14px;
  word-wrap: break-word;
}
.msg-content .user{
  margin-top: 2px;
  margin-left: 2px;
  margin-right: 10px;
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  box-shadow:  0 0 3px 0 rgba(0, 0, 0, .3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  box-sizing: border-box;
}

.msg-content .msg{
  margin-top: 9px;
  padding: 2px 10px;
  background-color: #e8e8e8;
  color: #323232;
  border-radius: 15px;
}

.msg-content.self {
  justify-content: flex-start;
  flex-direction: row-reverse;
}

.msg-content.self .user {
  margin-left: 10px;
  margin-right: 12px;
}
</style>