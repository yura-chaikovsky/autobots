function Gameplay(options) {
  var io = options.io;
  var players = {};
  var map = options.map;
  var currentTurn = 0;
  var started = false;

  if (!map) {
    throw new Error('Map is required!')
  }

  this.start = function() {
    var _this = this;

    started = true;

    _this.placePlayers();

    setInterval(function() {
      currentTurn++;

      console.log('Current turn: ' + currentTurn);

      _this.update();
      _this.broadcastState();
    }, options.tick);
  };

  this.isStarted = function() {
    return started;
  };

  this.update = function() {
    Object.keys(players).forEach(function(token) {
      var player = players[token];
      var action = player.getCurrentAction();

      console.log(player.name, ' = ', action);

      var x = player.position.x,
          y = player.position.y;

      switch (action) {
        case 'up':
          --y;
          break;

        case 'down':
          ++y;
          break;

        case 'left':
          --x;
          break;

        case 'right':
          ++x;
          break;
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
      players: Object.keys(players).map(function(token) {
        return players[token];
      })
    });
  };

  this.addPlayer = function(autobot) {
    players[autobot.id] = autobot;
  };

  this.addActions = function(token, actions) {
    var player = players[token];

    if (!player) {
      console.log('Invalid Token ' + token);

      return;
    }

    for (var i = 0; i < actions.length; i++) {
      player.addActions(actions[i]);
    }
  };

  this.placePlayers = function() {
    for (var i = 0; i < players.length; i++) {
      players[i].position = map.startPoritions[i];
    }
  };
}

module.exports = Gameplay;