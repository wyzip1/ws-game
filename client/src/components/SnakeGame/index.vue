<template>
  <div id="snake" ref="snakeEl"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import SnakeGame from '../../snake/game'

const snake = ref(new SnakeGame())
const snakeEl = ref()

const props = defineProps({ username: String })

window.s = snake.value

onMounted(() => {
  const ws = new WebSocket('ws://localhost:8087/snake?name=' + props.username)
  ws.onmessage = (res) => {
    const data = JSON.parse(res.data)
    switch (data.type) {
      case 'init':
        snake.value.foodList = data.foodList
        snake.value.userList = data.userList
        snake.value.setOptions(data.gameOptions)
        snake.value.init(snakeEl.value)
        snake.value.resetPlayer(playerInfo => {
          ws.send(JSON.stringify({ type: 'createPlayer', playerInfo }))
        })
        snake.value.controlEventListener((info) => {
          snake.value.syncing = true
          clearTimeout(snake.value.loopTimer)
          ws.send(JSON.stringify({ type: 'control', info }))
        })
        break;
      case 'control':
        Object.assign(snake.value.userList[data.index], data.info)
        snake.value.syncing = false
        snake.value.update()
        break;
      case 'createPlayer':
        snake.value.userList.push(data.playerInfo)
        break;
      case 'createFood':
        snake.value.addFood(data.foodInfo)
        break;
      case 'delUser':
        snake.value.userList.splice(data.index, 1)
        break;
      default:
        break;
    }
  }
})
</script>