var config = require('./config');

var Autobot = require('./autobot');
var Bullet = require('./bullet');
var Player = require('./player');

function Game(app, options) {
  var game = this;
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
      app.broadcastGameState(game);
    }, options.tick);
  };

  this.stop = function() {
    clearInterval(timer);
    started = false;
  };

  this.isStarted = function() {
    return started;
  };

  this.getState = function() {
    return {
      turn: currentTurn,
      map: map.getState(),
      autobots: autobots,
      bullets: bullets
    };
  };


  this.addPlayer = function(token) {
    if (!players[token]) {
      players[token] = createPlayer(token);
      autobots.push(players[token].autobot)
    }

    return players[token];
  };

  
  // Autobot actions
  
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
  
  
  // helpers

  function playTact() {
    autobots.forEach(function(autobot) {
      var action = autobot.getCurrentAction();

      if (action) {
        action.execute();
      }
    });

    Object.keys(bullets).forEach(function(id) {
      moveBulletTo(bullets[id]);
    });
  }

  function moveBulletTo(bullet) {
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
  }

  function destroyBullet(bullet) {
    delete bullets[bullet.id];
  }

  function isOccupied(position) {
    return autobots.some(function(autobot) {
      return position.equalTo(autobot.position);
    });
  }

  function createPlayer(token) {
    var autobot = new Autobot(game, {
      name: token,
      position: startPositions.shift(),
      direction: 'right',
      health: config.autobot.health
    });

    return new Player(token, autobot);
  }
}

module.exports = Game;