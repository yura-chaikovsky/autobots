var Autobot = require('./autobot');
var Player = require('./player');

function Game(options) {
  var io = options.io;
  var players = {};
  var autobots = [];
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
    var player = players[token];

    if (!player) {
      player = new Player(token, getAutobotByToken(token));
      players[token] = player;
      player.autobot.position = startPositions.shift();
      autobots.push(player.autobot)
    }

    return player;
  };


  function playTact() {
    autobots.forEach(function(autobot) {
      var action = autobot.getCurrentAction();

      if (!action) {
        return;
      }

      action.execute();

      if (!isPositionValid()) {
        action.undo();
      }
    });
  }

  function isPositionValid() {
    var positions = {};

    for (var i = 0; i < autobots.length; i++) {
      var autobot = autobots[i];
      var positionSlug = '_' + autobot.position.x + '_' + autobot.position.y;

      if (!map.isEmpty(autobot.position.x, autobot.position.y)) {
        return false;
      }

      if (positions[positionSlug]) {
        return false;
      }

      positions[positionSlug] = true;

    }

    return true;
  }

  function getAutobotByToken(token) {
    return new Autobot(token);
  }

  function broadcastState() {
    io.emit('state-update', {
      turn: currentTurn,
      map: map.getState(),
      autobots: autobots
    });
  }
}

module.exports = Game;