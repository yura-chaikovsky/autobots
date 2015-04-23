var mapGenerator = require('./map-generator');
var Game = require('./gameplay');

module.exports = {
  initialize: function(io, config) {
    var game = new Game(this, {
      map: mapGenerator.generate(config.map),
      tick: config.game.tick
    });

    this.io = io;

    io.on('connection', function(client) {
      var id = Date.now();
      var player;

      console.log('A user connected ' + id);

      client.on('menu-action', function(action) {
        console.log('User has selected: ' + action);

        if (!game.isStarted() && action === '#start') {
          game.start();
        }

        if (game.isStarted() && action === '#stop') {
          game.stop();
        }
      });

      client.on('join-game', function(data) {
        player = game.addPlayer(data.token);
        console.log(player.autobot.name + ' joined the game!');

        client.emit('registration', {
          id: player.autobot.id
        });
      });

      client.on('send-commands', function(data) {
        if (!game.isStarted()) {
          return console.log('The game has not started yet!');
        }

        if (!player) {
          return;
        }

        player.autobot.addAction(data.action, data.options)
      });

      client.on('disconnect', function() {
        console.log(id + ' disconnected');

        if (player) {
          console.log(player.autobot.name + ' left the game :(');
        }
      });
    });
  },
  broadcastGameState: function(game) {
    this.io.emit('state-update', game.getState());
  }
};
