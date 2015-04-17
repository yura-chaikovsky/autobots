var Autobot = require('./autobot');

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


  // manage the game

  this.start = function() {
    started = true;

    timer = setInterval(function() {
      ++currentTurn;
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


  // manage players

  this.addPlayer = function(token) {
    if (players[token]) {
      throw new Error('Autobot ' + token + ' is already registered');
    }

    players[token] = new Autobot(token);
    players[token].position = startPositions.shift();

    return players[token];
  };

  this.removePlayer = function(token) {
    if (players[token]) {
      delete players[token];
    }
  };


  // send command to the player's bot

  this.addAction = function(token, action, options) {
    var player = players[token];

    if (!player) {
      console.log('Invalid Token ' + token);

      return;
    }

    player.addAction(action, options);
  };

  function playTact() {
    Object.keys(players).forEach(function(token) {
      var player = players[token];
      var action = player.getCurrentAction();

      if (!action) {
        return;
      }

      action.execute();

      if (!map.isEmpty(player.position.x, player.position.y)) {
        action.undo();
      }
    });
  }

  function broadcastState() {
    io.emit('state-update', {
      turn: currentTurn,
      map: map.getState(),
      players: players
    });
  }
}

module.exports = Game;