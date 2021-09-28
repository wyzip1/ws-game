const { add, del, sendOther } = require('../utils');

exports.connect = (ws, query) => {
  const info = query.name + '进入房间';
  console.log('server:', info);
  sendOther(ws, info, 'tip')
  add(query.name, ws);
}

exports.close = (ws, query) => {
  del(query.name);
  const info = query.name + '离开房间';
  console.log('server:', info);
  sendOther(ws, info, 'tip')
}

