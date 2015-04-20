var Autobot = require('./autobot');
var Bullet = require('./bullet');
var Player = require('./player');

function Game(options) {
  var game = this;
  var io = options.io;
  var players = {};
  var autobots = [];
  var bullets = [];
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

  this.moveAutobotTo = function(options) {
    if (!map.isEmpty(options.x, options.y)) {
      return;
    }

    if (isOccupied(options.x, options.y)) {
      return;
    }

    options.autobot.position.x = options.x;
    options.autobot.position.y = options.y;
  };

  this.createBullet = function(options) {
    bullets.push( new Bullet(game, options) );
  };

  function isOccupied(x, y) {
    return autobots.some(function(autobot) {
      return x === autobot.position.x && y === autobot.position.y;
    });
  }

  function playTact() {
    autobots.forEach(function(autobot) {
      var action = autobot.getCurrentAction();

      if (action) {
        action.execute();
      }
    });
  }

  function getAutobotByToken(token) {
    return new Autobot(game, { name: token });
  }

  function broadcastState() {
    io.emit('state-update', {
      turn: currentTurn,
      map: map.getState(),
      autobots: autobots,
      bullets: bullets
    });
  }
}

module.exports = Game;