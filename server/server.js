var server = require('http').Server(handler);
var fs = require('fs');
var io = require('socket.io')(server);
var app = require('../prototypes/server/app.js');

var PORT = 8000;

console.log('listening on *:' + PORT);
server.listen(PORT);

function handler(req, res) {
  if (req.method === 'GET' && req.url === '/') {
    var content = fs.readFileSync('index.html');
  }

  res.writeHead(200);
  res.end(content);
}

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('menu-action', function(action) {
    console.log('User has selected: ' + action);
    
    if ('#start' === action) {
      app.run(io);
    }
  });
});
