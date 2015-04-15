var fs = require('fs');
var server = require('http').Server(handler);

var PORT = 8000;

var gameSettings = {
  tick: 300,
  width: 10,
  height: 10,
  io: require('socket.io')(server)
};

var app = new require('../prototypes/server/app.js')(gameSettings);

console.log('listening on *:' + PORT);
server.listen(PORT);

function handler(req, res) {
  if (req.method === 'GET' && req.url === '/') {
    var content = fs.readFileSync('index.html');
  }

  res.writeHead(200);
  res.end(content);
}
