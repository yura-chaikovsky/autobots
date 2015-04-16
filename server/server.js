var fs = require('fs');
var server = require('http').Server(handler);
var io = require('socket.io')(server);
var app = new require('../prototypes/server/app.js');

var PORT = 8000;

app.run({
  tick: 300,
  width: 11,
  height: 11,
  io: io
});

console.log('listening on *:' + PORT);
server.listen(PORT);

function handler(req, res) {
  if (req.method === 'GET' && req.url === '/') {
    var content = fs.readFileSync('index.html');
  }

  res.writeHead(200);
  res.end(content);
}
