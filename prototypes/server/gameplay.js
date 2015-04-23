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

  this.doAutobotMove = function(autobot, options) {
    var newPosition = autobot.position.getSibling(options.direction);

    autobot.direction = options.direction;

    if (!map.isEmpty(newPosition)) {
      return;
    }

    if (isOccupied(newPosition)) {
      return;
    }

    autobot.moveTo(newPosition);
  };

  this.doAutobotFire = function(autobot, options) {
    var bullet = new Bullet({
      direction: autobot.direction,
      position: autobot.position.clone()
    });

    bullets[bullet.id] = bullet;
  };

  this.moveBulletTo = function(bullet) {
    var newPosition = bullet.position.getSibling(bullet.direction);

    if (!map.isEmpty(newPosition)) {
      destroyBullet(bullet);

      return;
    }

    if (isOccupied(newPosition)) {
      destroyBullet(bullet);

      return;
    }

    bullet.position.copyFrom(newPosition);
  };

  function destroyBullet(bullet) {
    delete bullets[bullet.id];
  }

  function isOccupied(position) {
    return autobots.some(function(autobot) {
      return position.equalTo(autobot.position);
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