var server = require('http').Server(handler);
var fs = require('fs');
var io = require('socket.io')(server);

var currentTurn = 0;
var TICK = 5000;
var PORT = 8000;

server.listen(PORT);

setInterval(function() {
  currentTurn++;

  console.log('Current turn: ' + currentTurn);
  io.emit('next-turn', { turn: currentTurn })
}, TICK);


function handler(req, res) {
  if (req.method === 'GET' && req.url === '/') {
    console.log('listening on *:' + PORT);

    res.writeHead(200);
    res.end(fs.readFileSync('index.html'));
  }

  res.writeHead(200);
  res.end('');
}

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('menu-action', function(action) {
    console.log('User has selected: ' + action);
  });
});






