var Autobot = require('./autobot');
var Bullet = require('./bullet');
var Wall = require('./wall');
var Map = require('./map');
var Player = require('./player');

function Game(app, options) {
  var game = this;
  var players = [];
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

      if (map.getBots().length < 2) {
        game.stop();
      }
    }, options.tick);
  };

  this.join = function(token) {
    var player = this.getPlayer(token);

    if (player) {
      return;
    }

    player = new Player(token, game);
    players.push(player);

    // direction should be random
    player.autobot = new Autobot({
      name: token,
      direction: 'right'
    });

    map.add(player.autobot, map.getStartPosition());
  };

  this.getPlayer = function(token) {
    return players.filter(function(player) {
      return player.token === token;
    })[0];
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
      autobots: map.getBots().map(getItemState),
      bullets: map.getBullets().map(getItemState),
      walls: map.getWalls().map(getItemState)
    };

    function getItemState(item) {
      return item.getState();
    }
  };


  this.getView = function() {
    return {
      turn: currentTurn,
      autobots: map.getBots(),
      bullets: map.getBullets(),
      map: map.getField()
    };
  };

  
  // Autobot actions
  
  this.doAutobotMove = function(bot, options) {
    bot.direction = options.rotation || options.direction || bot.direction;

    if (options.direction) {
      moveBot(bot, options.direction);
    }
  };

  this.doAutobotFire = function(autobot, options) {
    var bullet = new Bullet({
      direction: autobot.direction
    }, game);

    map.add(bullet, autobot.position.clone());
  };


  // helpers

  function playTact() {
    map.getBullets().forEach(function(bullet) {
      --bullet.busyCount;

      if (bullet.busyCount > 0) {
        return;
      }

      bullet.busyCount = Bullet.moveDuration;

      moveBullet(bullet);
    });

    players.forEach(function(player) {
      var action;

      --player.autobot.busyCount;

      if (player.autobot.busyCount > 0) {
        return;
      }

      action = player.getCurrentAction();

      player.autobot.busyCount = action.duration;

      action.execute();
    });
  }

  function moveBullet(bullet) {
    var newPosition = bullet.position.getSibling(bullet.direction);
    var mapItem = map.getItem(newPosition);

    map.move(bullet, newPosition);

    switch (mapItem.type) {
      case Map.EMPTY.type:
        return;

      case Map.OUTSIDE.type:
        map.remove(bullet);
        return;
    }

    doHit(mapItem, bullet);
  }

  function moveBot(bot, direction) {
    var newPosition = bot.position.getSibling(direction);
    var mapItem = map.getItem(newPosition);

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
}

module.exports = Game;