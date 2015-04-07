function Gameplay(options) {
  var io = options.io;
  var players = [];
  var map = options.map;
  var currentTurn = 0;

  if (!map) {
    throw new Error('Map is required!')
  }

  this.start = function() {
    var _this = this;

    _this.placePlayers();

    setInterval(function() {
      currentTurn++;

      console.log('Current turn: ' + currentTurn);

      _this.update();
      _this.broadcastState();
    }, options.tick);
  };

  this.update = function() {
    players.forEach(function(player) {
      var action = player.getCurrentAction();

      console.log(player.name, ' = ', action);

      var x = player.position.x,
          y = player.position.y;

      if ('up' === action) {
        --y;
      } else if ('down' === action) {
        ++y
      } else if ('left' === action) {
        --x
      } else if ('right' === action) {
        ++x;
      }

      if (map.isEmpty(x, y)) {
        player.position.x = x;
        player.position.y = y;
      }
    });
  };

  this.broadcastState = function() {
    io.emit('state-update', {
      turn: currentTurn,
      map: map.getState(),
      players: players
    });
  };

  this.addPlayer = function(autobot) {
    players.push(autobot);
  };

  this.placePlayers = function() {
    for (var i = 0; i < players.length; i++) {
      players[i].position = map.startPoritions[i];
    }
  };
}

module.exports = Gameplay;