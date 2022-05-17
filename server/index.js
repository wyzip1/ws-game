const WebSocketServer = require('wsr-w');
const server = new WebSocketServer({ port: 8087 });
const controller = require('./controller')
const { sendOther } = require('./utils');

const foodList = []
const players = []
const userList = []
const gameOptions = {
  width: 1000,
  height: 1000,
  background: '#000',
  objSize: 10,
  maxFood: 100,
  thrroteTime: 100
}

let isStart = false

function setIntervalCreateFood(callback) {
  if(isStart) return 
  isStart = true
  const _food = createFood()
  foodList.push(_food)
  callback(_food)
  setInterval(() => {
    if(foodList.length >= gameOptions.maxFood) return
    const food = createFood();
    foodList.push(food)
    callback(food)
  }, 100);
}
function createFood(option) {
  const { x, y, size } = option || getCanUsePos()
  const color = option?.color || { hue: 100, saturation: 100, brightness: 75 }
  return { tag: 'food', x, y, size, color }
}

function getCanUsePos() {
  const { width, height, objSize } = gameOptions
  const x = random(0, width / objSize) * objSize - objSize;
  const y = random(0, height / objSize) * objSize - objSize;
  return { x, y, size: objSize }
}

function random(start, end) {
  return Math.floor(Math.random() * (end - start + 1) + start)
}



server.on('connection', (on, use, ws) => {
  use('/chatroom', (res, ws, req, wss, next) => {
    if(controller[res.type]) return controller[res.type](ws, req.query);
    next()
  })
  on('/chatroom', (res, ws, req, wss) => {
    sendOther(ws, {data: res.data.toString(), user: req.query.name})
  })

  use('/snake', (res, ws, req, wss, next) => {
    if(res.type === 'connect') {
      players[req.query.name] = ws;
      ws.send(JSON.stringify({ type: 'init', foodList, gameOptions, userList }));
      setIntervalCreateFood((foodInfo) => {
        Object.keys(players).forEach(name => players[name].send(JSON.stringify({ type: 'createFood', foodInfo })))
      })
    } else if(res.type === 'close') {
      delete players[req.query.name]
      const leveUserIndex = userList.findIndex(user => {
        console.log(user.username, req.query.name);
        return user.username === req.query.name
      })
      if(leveUserIndex === -1) return
      userList.splice(leveUserIndex, 1)
      Object.keys(players).forEach(name => players[name].send(JSON.stringify({ type: 'delUser', index: leveUserIndex })))
    } else next()
  })

  on('/snake', (res, ws, req, wss) => {
    const data = JSON.parse(res.data)
    switch (data.type) {
      case 'createPlayer':
        data.playerInfo.username = req.query.name
        userList.push(data.playerInfo)
        Object.keys(players).forEach(name => players[name]!== ws && players[name].send(JSON.stringify({ type: 'createPlayer', playerInfo: data.playerInfo })))
        break;
      case 'control':
        const userIndex = userList.findIndex(user => user.username === req.query.name)
        if(userIndex === -1) return
        Object.assign(userList[userIndex], data.info)
        Object.keys(players).forEach(name => players[name].send(JSON.stringify({ type: 'control', info: data.info, index: userIndex })))
        break;
      default:
        break;
    }
  })
});