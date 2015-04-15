var mapGenerator = require('./map-generator');
var Gameplay = require('./gameplay');
var Autobot = require('./autobot');

var actions = ['', 'up', 'down', 'right', 'left'];

function App(options) {
  var io = options.io;

  var game = new Gameplay({
    io: io,
    map: mapGenerator.generate(options.width, options.height),
    tick: options.tick
  });

  io.on('connection', function(socket) {
    var id = Date.now();
    var autobot;

    console.log('a user connected ' + id);

    socket.on('disconnect', function() {
      console.log('user disconnected ' + id);
    });

    socket.on('menu-action', function(action) {
      console.log('User has selected: ' + action);

      if (!game.isStarted() && action === '#start') {
        game.start();
      }
    });

    socket.on('join-game', function(data) {
      if (game.isStarted()) {
        console.log('The game has already started! Please wait the next one.');

        return;
      }

      console.log(data.name + ' joined the game!');
      autobot = new Autobot(data.name);
      game.addPlayer(autobot);
    });

    socket.on('send-commands', function(data) {
      if (!game.isStarted()) {
        console.log('The game has not started yet!');

        return;
      }

      autobot.addAction(data.action)
    });
  });
}

module.exports = App;
