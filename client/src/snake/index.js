const gameOptions = {
  width: 1000,
  height: 1000,
  background: '#000',
  objSize: 10,
  maxFood: 100,
  thrroteTime: 300
}

const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')
const userList = []
const foodList = []

const gameObjFlatList = []

let currentPlayer = null;

const directionMap = {
  ArrowUp: ['y', -gameOptions.objSize],
  ArrowLeft: ['x', -gameOptions.objSize],
  ArrowDown: ['y', gameOptions.objSize],
  ArrowRight: ['x', gameOptions.objSize]
}

const reverseMap = {
  ArrowUp: 'ArrowDown',
  ArrowDown: 'ArrowUp',
  ArrowLeft: 'ArrowRight',
  ArrowRight: 'ArrowLeft'
}

const thrrote_move = thrrote(move, gameOptions.thrroteTime)

// let otheruser = null

init()

function init() {
  canvas.width = gameOptions.width
  canvas.height = gameOptions.height
  document.body.appendChild(canvas)
  currentPlayer = createPlayer()
  // otheruser = [createPlayer(),createPlayer(),createPlayer(),createPlayer(),createPlayer(),createPlayer(),createPlayer(),createPlayer(),createPlayer(),createPlayer()]
  userList.push(currentPlayer)
  gameObjFlatList.push(currentPlayer);
  controlEvent(currentPlayer)
  setIntervalCreateFood()
  update()
}

// function randomDirection() {
//   const mapping = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
//   const direction = random(0, 3)
//   const directionCode = mapping[direction]
//   return { direction: directionMap[directionCode], directionCode }
// }

// function changeotheruserdirection() {
//   for (let i = 0; i < otheruser.length; i++) {
//     const user = otheruser[i];
//     if(user.death || user.isChange) continue
//     if(random(0, 10000) > 9750) {
//       const d = randomDirection()
//       if(reverseMap[d.directionCode] === user.directionCode || d.directionCode === user.directionCode) continue
//       Object.assign(user, d)
//       user.isChange = true
//       setTimeout(() => {
//         user.isChange = false
//       }, gameOptions.thrroteTime);
//     }
//   }
// }

function controlEvent(player) {
  window.addEventListener('keydown', thrrote(e => {
    if(reverseMap[e.code] === player.directionCode && player.body.length) return
    const direction = directionMap[e.code];
    if(Array.isArray(direction)) {
      player.direction = direction
      player.directionCode = e.code
    }
  }, gameOptions.thrroteTime))
}

function move() {
  for (let i = 0; i < userList.length; i++) {
    const player = userList[i];
    if(player.death) continue
    const [pos, num] = player.direction
    if(!pos || !num) continue
    const { x, y } = player
    const next = { x, y }
    next[pos] += num
    deathCheck(player, pos, next, () => {
      const { x, y } = player
      Object.assign(player, next)
      player.body.reduce((prev, value) => {
        value.protected = false
        const { x, y } = value
        Object.assign(value, prev)
        return { x , y }
      }, { x, y })
    })
  }
}

function setIntervalCreateFood() {
  foodList.push(createFood())
  setInterval(() => {
    if(foodList.length >= gameOptions.maxFood) return
    foodList.push(createFood())
  }, 100);
}

function deathCheck(player, pos, next, callback) {
  const posMap = { x: 'width', y: 'height' }
  const gameMax = gameOptions[posMap[pos]]
  const collision = !!gameObjFlatList.find(o => {
    return o !== player && !o.protected && o.x === next.x && o.y === next.y
  })
  if(next[pos] < 0 || next[pos] >= gameMax || collision) {
    player.death = true
  } else callback()
}

function eatCheck() {
  for (const player of userList) {
    for (let j = 0; j < foodList.length; j ++) {
      const food = foodList[j]
      if(player.x === food.x && player.y === food.y) {
        foodList.splice(j ,1)
        createBody(player)
        j--
      }
    }
  }
}

function update() {
  requestAnimationFrame(update)
  drawBackground()
  // changeotheruserdirection();
  thrrote_move()
  eatCheck()
  userList.forEach(player => {
    drawPlayer(player)
  })
  foodList.forEach(food => {
    const { x, y, size, color } = food
    const style = colorCovertStyle(color)
    drawFood(x, y, size, style)
  })
  ctx.stroke()
}

function createPlayer() {
  const { x, y, size } = getCanUsePos()
  const color = { hue: random(0, 360), saturation: 100, brightness: 75 };
  return { tag: 'player', x, y, size, color, body: [], direction: [], directionCode: null, death: false }
}

function createBody(player) {
  const { x, y, size, color } = player
  const body = { tag: 'body', x, y, size, color: Object.assign({...color}, { brightness: 80 }), protected: true, header: player }
  player.body.push(body)
  gameObjFlatList.push(body)
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

function drawPlayer(player) {
  const { x, y, size, color, body } = player
  ctx.beginPath()
  ctx.fillStyle = colorCovertStyle(color)
  ctx.fillRect(x, y, size, size)
  ctx.closePath();
  if(body) body.forEach(_b => drawPlayer(_b))
}

function drawFood(x, y, size, color) {
  const r = size / 2
  ctx.beginPath()
  ctx.fillStyle = color
  ctx.arc(x + r, y + r, r, 0, 2 * Math.PI)
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

function thrrote(callback, delay) {
  let timer;
  return (...rest) => {
    if(timer) return
    callback(...rest)
    timer =  setTimeout(() => timer = null, delay);
  }
}