function Game(options) {
  var io = options.io;
  var players = {};
  var map = options.map;
  var startPositions = map.getStartPositions();
  var currentTurn = 0;
  var started = false;
  var timer;

  if (!map) {
    throw new Error('Map is required!')
  }

  this.start = function() {
    started = true;

    timer = setInterval(function() {
      currentTurn++;
      console.log('Current turn: ' + currentTurn);

      playTact();
      broadcastState();
    }, options.tick);
  };

  this.stop = function() {
    clearInterval(timer);
    started = false;
  };

  this.isStarted = function() {
    return started;
  };

  this.addPlayer = function(autobot) {
    players[autobot.id] = autobot;
    autobot.position = startPositions.shift();
  };

  this.removePlayer = function(autobot) {
    if (players[autobot.id]) {
      delete players[autobot.id];
    }
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

  function playTact() {
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
  }

  function broadcastState() {
    io.emit('state-update', {
      turn: currentTurn,
      map: map.getState(),
      players: Object.keys(players).map(function(token) {
        return players[token];
      })
    });
  }
}

module.exports = Game;