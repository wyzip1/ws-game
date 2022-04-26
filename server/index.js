const WebSocketServer = require('wsr-w');
const server = new WebSocketServer({ port: 8085 });
const controller = require('./controller')
const { sendOther } = require('./utils');


server.on('connection', (on, use, ws) => {
  use('/chatroom', (res, ws, req, wss, next) => {
    if(controller[res.type]) return controller[res.type](ws, req.query);
    next()
  })
  on('/chatroom', (res, ws, req, wss) => {
    sendOther(ws, {data: res.data.toString(), user: req.query.name})
  })
});