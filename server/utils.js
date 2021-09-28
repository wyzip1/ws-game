const aggregate = {};

exports.sendOther = (self, info, type = 'msg') => {
  for(let i of Object.keys(aggregate)) {
    if(aggregate[i] === self) continue;
    aggregate[i].send(JSON.stringify({type, info}));
  }
}

exports.add = (key, ws) => {
  aggregate[key] = ws;
}

exports.del = (key) => {
  delete aggregate[key];
}