const WebSocketServer = require('wsr-w');
const server = new WebSocketServer({ port: 5000 });
const controller = require('./controller')
const { sendOther } = require('./utils');


server.on('connection', (on, use, ws) => {
  use('/test', (res, ws, req, wss, next) => {
    if(controller[res.type]) return controller[res.type](ws, req.query);
    next()
  })
  on('/test', (res, ws, req, wss) => {
    sendOther(ws, {data: res.data.toString(), user: req.query.name})
  })
});