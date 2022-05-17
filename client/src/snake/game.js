export default class SnakeGame {
  gameOptions = {
    width: 1000,
    height: 1000,
    background: '#000',
    objSize: 10,
    maxFood: 100,
    thrroteTime: 100
  }

  canvas = document.createElement('canvas')
  ctx = this.canvas.getContext('2d')
  userList = []
  foodList = []
  gameObjFlatList = []

  currentPlayer = null;

  directionMap = {
    ArrowUp: ['y', -this.gameOptions.objSize],
    ArrowLeft: ['x', -this.gameOptions.objSize],
    ArrowDown: ['y', this.gameOptions.objSize],
    ArrowRight: ['x', this.gameOptions.objSize]
  }

  reverseMap = {
    ArrowUp: 'ArrowDown',
    ArrowDown: 'ArrowUp',
    ArrowLeft: 'ArrowRight',
    ArrowRight: 'ArrowLeft'
  }

  syncing = false

  constructor(gameOptions) {
    this.setOptions(gameOptions)
  }

  setOptions(gameOptions) {
    Object.assign(this.gameOptions, gameOptions);
  }

  controlEventListenerFn = null
  controlEventListener(listener) {
    this.controlEventListenerFn = listener
  }

  init(targetEl) {
    const { canvas, gameOptions } = this
    canvas.width = gameOptions.width
    canvas.height = gameOptions.height;
    (targetEl || document.body).appendChild(canvas)
    this.update()
  }

  addUser(userData) {
    this.userList.push(userData)
  }

  addFood(foodData) {
    this.foodList.push(foodData)
  }

  controlEventFn = null

  controlEvent(player) {
    window.removeEventListener('keydown', this.controlEventFn)

    this.controlEventFn = e => {
      if(this.reverseMap[e.code] === player.directionCode && player.body.length) return
      const direction = this.directionMap[e.code];
      if(Array.isArray(direction)) {
        this.controlEventListenerFn && this.controlEventListenerFn({ direction, directionCode: e.code })
      }
    }, this.gameOptions.thrroteTime
    
    window.addEventListener('keydown', this.controlEventFn)
  }

  move() {
    for (let i = 0; i < this.userList.length; i++) {
      const player = this.userList[i];
      if(player.death) continue
      const [pos, num] = player.direction
      if(!pos || !num) continue
      const { x, y } = player
      const next = { x, y }
      next[pos] += num
      this.deathCheck(player, i, pos, next, () => {
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

  deathCheck(player, index, pos, next, callback) {
    const posMap = { x: 'width', y: 'height' }
    const gameMax = this.gameOptions[posMap[pos]]
    const collision = !!this.gameObjFlatList.find(o => {
      return o !== player && !o.protected && o.x === next.x && o.y === next.y
    })
    if(next[pos] < 0 || next[pos] >= gameMax || collision) {
      player.death = true
      this.playerToFood(index, player)
      this.resetPlayer()
    } else callback()
  }

  eatCheck() {
    for (const player of this.userList) {
      for (let j = 0; j < this.foodList.length; j ++) {
        const food = this.foodList[j]
        if(player.x === food.x && player.y === food.y) {
          this.foodList.splice(j ,1)
          this.createBody(player)
          j--
        }
      }
    }
  }

  listenerFn = null

  resetPlayer(listener) {
    if(typeof listener === 'function') this.listenerFn = listener
    this.currentPlayer = this.createPlayer()
    this.userList.push(this.currentPlayer)
    this.gameObjFlatList.push(this.currentPlayer);
    this.controlEvent(this.currentPlayer)
    this.listenerFn(this.currentPlayer)
  }

  loopTimer = null

  update() {
    console.log('update');
    if(this.syncing) return clearTimeout(this.loopTimer)
    else this.loopTimer = setTimeout(this.update.bind(this), this.gameOptions.thrroteTime);
    this.drawBackground()
    this.move()
    this.eatCheck()
    this.userList.forEach(player => {
      this.drawPlayer(player)
    })
    this.foodList.forEach(food => {
      const { x, y, size, color } = food
      const style = colorCovertStyle(color)
      this.drawFood(x, y, size, style)
    })
    this.ctx.stroke()
  }

  createPlayer() {
    const { x, y, size } = this.getCanUsePos()
    const color = { hue: random(0, 360), saturation: 100, brightness: 75 };
    return { tag: 'player', x, y, size, color, body: [], direction: [], directionCode: null, death: false, uid: guid() }
  }

  playerToFood(userListIndex, player) {
    if(userListIndex !== undefined) this.userList.splice(userListIndex, 1)
    else this.userList.splice(this.userList.indexOf(player))
    this.foodList.push(this.createFood(player))
    this.gameObjFlatList.splice(this.gameObjFlatList.indexOf(player), 1)
    player.body.forEach(b => {
      this.foodList.push(this.createFood(b))
      this.gameObjFlatList.splice(this.gameObjFlatList.indexOf(b), 1)
    })
  }

  createBody(player) {
    const { x, y, size, color } = player
    const body = { tag: 'body', x, y, size, color: Object.assign({...color}, { brightness: 80 }), protected: true, header: player }
    player.body.push(body)
    this.gameObjFlatList.push(body)
  }

  drawBackground() {
    this.ctx.fillStyle = this.gameOptions.background
    this.ctx.fillRect(0, 0, this.gameOptions.width, this.gameOptions.height)
  }

  drawPlayer(player) {
    const { x, y, size, color, body } = player
    this.ctx.beginPath()
    this.ctx.fillStyle = colorCovertStyle(color)
    this.ctx.fillRect(x, y, size, size)
    this.ctx.closePath();
    if(body) body.forEach(_b => this.drawPlayer(_b))
  }

  drawFood(x, y, size, color) {
    const r = size / 2
    this.ctx.beginPath()
    this.ctx.fillStyle = color
    this.ctx.arc(x + r, y + r, r, 0, 2 * Math.PI)
    this.ctx.fill()
    this.ctx.closePath()
  }

  getCanUsePos() {
    const { width, height, objSize } = this.gameOptions
    const x = random(0, width / objSize) * objSize - objSize;
    const y = random(0, height / objSize) * objSize - objSize;
    return { x, y, size: objSize }
  }

}

function colorCovertStyle(color) {
  return `hsl(${color.hue},${color.saturation}%,${color.brightness}%)`
}

function random(start, end) {
  return Math.floor(Math.random() * (end - start + 1) + start)
}

function thrrote(callback, delay, target) {
  let timer;
  return (...rest) => {
    if(timer) return
    callback.call(target, ...rest)
    timer =  setTimeout(() => timer = null, delay);
  }
}

function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
}