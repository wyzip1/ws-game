const gameOptions = {
  loopTime: 300,
  width: 1000,
  height: 1000,
  background: '#000',
  objSize: 10
}

const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')
const userList = []
const foodList = []

let currentPlayer = null;

const directionMap = {
  ArrowUp: ['y', -1],
  ArrowLeft: ['x', -1],
  ArrowDown: ['y', 1],
  ArrowRight: ['x', 1]
}

init()

function init() {
  window.addEventListener('keydown', e => {
    currentPlayer.direction = directionMap[e.code]
  })
  canvas.width = gameOptions.width
  canvas.height = gameOptions.height
  document.body.appendChild(canvas)
  currentPlayer = createPlayer()
  userList.push(currentPlayer)
  setIntervalCreateFood()
  update()
}

function move() {
  const [pos, num] = currentPlayer.direction
  if(!pos || !num) return
  currentPlayer[pos] += num
}

function setIntervalCreateFood() {
  foodList.push(createFood())
  setInterval(() => {
    if(foodList.length >= 100) return
    foodList.push(createFood())
  }, 100);
}

function update() {
  requestAnimationFrame(update)
  drawBackground()
  userList.forEach(player => {
    const { x, y, size, color } = player
    const style = colorCovertStyle(color)
    drawPlayer(x, y, size, style)
  })
  foodList.forEach(food => {
    const { x, y, size, color } = food
    const style = colorCovertStyle(color)
    drawFood(x, y, size, style)
  })
  ctx.stroke()
  move()
}

function createPlayer() {
  const { x, y, size } = getCanUsePos()
  const color = { hue: random(0, 360), saturation: 100, brightness: 75 };
  return { tag: 'player', x, y, size, color, body: [], direction: [] }
}

function createFood() {
  const { x, y, size } = getCanUsePos()
  const color = { hue: 100, saturation: 100, brightness: 75 }
  return { tag: 'food', x, y, size, color }
}

function drawBackground() {
  ctx.fillStyle = gameOptions.background
  ctx.fillRect(0, 0, gameOptions.width, gameOptions.height)
}

function drawPlayer(x, y, size, color) {
  ctx.beginPath()
  ctx.fillStyle = color
  ctx.fillRect(x, y, size, size)
  ctx.closePath();
}

function drawFood(x, y, size, color) {
  ctx.beginPath()
  ctx.fillStyle = color
  ctx.arc(x, y, size / 2, 0, 2 * Math.PI)
  ctx.fill()
  ctx.closePath()
}

function getCanUsePos() {
  const { width, height, objSize } = gameOptions
  const x = random(0, width / objSize) * objSize - objSize;
  const y = random(0, height / objSize) * objSize - objSize;
  return { x, y, size: objSize }
}

function colorCovertStyle(color) {
  return `hsl(${color.hue},${color.saturation}%,${color.brightness}%)`
}

function random(start, end) {
  return Math.floor(Math.random() * (end - start + 1) + start)
}