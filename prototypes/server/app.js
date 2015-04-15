var MapGenerator = require('./map-generator');
var Gameplay = require('./gameplay');
var Autobot = require('./autobot');
var mapGenerator = new MapGenerator();

var actions = ['', 'up', 'down', 'right', 'left'];

function App(options) {
  var io = options.io;

  var game = new Gameplay({
    io: io,
    map: mapGenerator.generate(options.width, options.height),
    tick: options.tick
  });

  io.on('connection', function(socket) {
    var userId = Date.now();
    var autobot = new Autobot(userId);

    for (var i = 0; i < 1e3; i++) {
      autobot.addAction(actions[Math.floor(Math.random() * 5)]);
    }

    console.log('a user connected ' + userId);
    socket.on('disconnect', function() {
      console.log('user disconnected ' + userId);
    });

    socket.on('menu-action', function(action) {
      console.log('User has selected: ' + action);

      if (!game.isStarted() && '#start' === action) {
        game.start();
      }

      if (!game.isStarted() && '#join-game' === action) {
        game.addPlayer(autobot);
      }
    });
  });
}

module.exports = App;
