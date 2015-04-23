var config = require('./config');

var Autobot = require('./autobot');
var Bullet = require('./bullet');
var Player = require('./player');

function Game(app, options) {
  var game = this;
  var players = {};
  var map = options.map;
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
      map: map.getField(),
      autobots: map.getBots(),
      bullets: map.getBullets(),
      walls: map.getWalls()
    };
  };

  this.addPlayer = function(token) {
    if (!players[token]) {
      players[token] = createPlayer(token);
      map.place(players[token].autobot, map.getStartPosition());
    }

    return players[token];
  };

  
  // Autobot actions
  
  this.doAutobotMove = function(autobot, options) {
    var newPosition = autobot.position.getSibling(options.direction);

    autobot.direction = options.direction;

    if (map.isEmpty(newPosition)) {
      map.place(autobot, newPosition);
    }
  };

  this.doAutobotFire = function(autobot, options) {
    var bullet = new Bullet({
      direction: autobot.direction
    });

    map.place(bullet, autobot.position.clone());
  };
  
  
  // helpers

  function playTact() {
    map.getBots().forEach(function(autobot) {
      autobot.getCurrentAction().execute();
    });

    map.getBullets().forEach(function(bullet) {
      moveBullet(bullet);
    });
  }

  function moveBullet(bullet) {
    var newPosition = bullet.position.getSibling(bullet.direction);

    if (!map.isEmpty(newPosition)) {
      map.remove(bullet);

      return;
    }

    bullet.position = newPosition;
  }

  function createPlayer(token) {
    var botOptions = {
      name: token,
      direction: 'right',
      health: config.autobot.health
    };

    return new Player(token, new Autobot(botOptions, game));
  }
}

module.exports = Game;