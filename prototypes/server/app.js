var mapGenerator = require('./map-generator');
var Game = require('./gameplay');
var Autobot = require('./autobot');

module.exports = {
  run: function(options) {
    var game = new Game({
      io: options.io,
      map: mapGenerator.generate(options.width, options.height),
      tick: options.tick
    });

    options.io.on('connection', function(socket) {
      var id = Date.now();
      var autobot;

      console.log('a user connected ' + id);

      socket.on('disconnect', function() {
        console.log('user disconnected ' + id);

        if (autobot) {
          game.removePlayer(autobot);
        }
      });

      socket.on('menu-action', function(action) {
        console.log('User has selected: ' + action);

        if (!game.isStarted() && action === '#start') {
          game.start();
        }

        if (game.isStarted() && action === '#stop') {
          game.stop();
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
};
