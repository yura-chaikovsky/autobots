var config = require('./config');

var Autobot = require('./autobot');
var Bullet = require('./bullet');
var Wall = require('./wall');
var Map = require('./map');
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
      autobots: map.getBots(),
      bullets: map.getBullets(),
      walls: map.getWalls()
    };
  };

  this.getView = function() {
    return {
      turn: currentTurn,
      autobots: map.getBots(),
      bullets: map.getBullets(),
      map: map.getField()
    };
  };

  this.addPlayer = function(token) {
    if (!players[token]) {
      players[token] = createPlayer(token);
      map.add(players[token].autobot, map.getStartPosition());
    }

    return players[token];
  };

  
  // Autobot actions
  
  this.doAutobotMove = function(bot, options) {
    var newPosition = bot.position.getSibling(options.direction);
    var mapItem = map.getItem(newPosition);

    bot.direction = options.direction;

    switch (mapItem.type) {
      case Map.OUTSIDE.type:
      case Autobot.TYPE:
      case Wall.TYPE:
        return;

      case Bullet.TYPE:
        map.move(bot, newPosition);
        doHit(bot, mapItem);
        return;

      case Map.EMPTY.type:
        map.move(bot, newPosition);
        return;
    }
  };

  this.doAutobotFire = function(autobot, options) {
    var bullet = new Bullet({
      direction: autobot.direction
    }, game);

    map.add(bullet, autobot.position.clone());
    moveBullet(bullet);
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
    var mapItem = map.getItem(newPosition);

    switch (mapItem.type) {
      case Map.EMPTY.type:
        map.move(bullet, newPosition);
        return;

      case Map.OUTSIDE.type:
        map.remove(bullet);
        return;
    }

    doHit(mapItem, bullet);
  }

  function doHit(item, bullet) {
    item.hit();
    checkCondition(item);

    bullet.hit();
    checkCondition(bullet);
  }

  function checkCondition(item) {
    if (item.getState().health <= 0) {
      map.remove(item);
    }
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