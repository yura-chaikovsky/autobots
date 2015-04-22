var Autobot = require('./autobot');
var Bullet = require('./bullet');
var Player = require('./player');

function Game(options) {
  var game = this;
  var io = options.io;
  var players = {};
  var autobots = [];
  var bullets = {};
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

  this.moveBulletTo = function(bullet) {
    var x = bullet.position.x;
    var y = bullet.position.y;

    switch (bullet.direction) {
      case 'up':
        ++y;
        break;

      case 'down':
        --y;
        break;

      case 'right':
        ++x;
        break;

      case 'left':
        --x;
        break;
    }

    if (!map.isEmpty(x, y)) {
      destroyBullet(bullet);

      return;
    }

    if (isOccupied(x, y)) {
      destroyBullet(bullet);

      return;
    }

    bullet.position.x = x;
    bullet.position.y = y;
  };

  this.createBullet = function(options) {
    var bullet = new Bullet(options);

    bullets[bullet.id] = bullet;
  };

  function destroyBullet(bullet) {
    delete bullets[bullet.id];
  }

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

    Object.keys(bullets).forEach(function(id) {
      game.moveBulletTo(bullets[id]);
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