var ACTIONS = require('./actions');
var Autobot = require('./autobot');
var Bullet = require('./bullet');
var Wall = require('./wall');
var Map = require('./map');

function Combat(game, options) {
  var _this = this;
  var map = options.map;
  var players = options.players;
  var currentTurn = 0;
  var timer;


  players.forEach(function(player) {
    player.autobot = new Autobot({
      playerId: player.id,
      name: player.name,
      direction: 'right'
    });

    map.add(player.autobot, map.getStartPosition());
  });

  // manage the game

  this.start = function() {
    timer = setInterval(function() {
      ++currentTurn;
      console.log('Current turn: ' + currentTurn);

      playTact();
      game.broadcastCombatState(_this);

      if (map.getBots().length < 2) {
        _this.stop();
      }
    }, options.config.tick);
  };

  this.stop = function() {
    clearInterval(timer);

    players.forEach(function(player) {
      player.autobot = null;
    });

    game.finishCombat(this);
  };

  this.addAction = function(player, actionName, actionData) {
    var action = ACTIONS[Autobot.TYPE][actionName];

    if (!action) {
      return;
    }

    player.autobot.addAction(action(this, player.autobot, actionData))
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
    var state = this.getState();

    state.map = map.getField();

    return state;
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
    });

    map.add(bullet, autobot.position.clone());

    bullet.addAction(ACTIONS[Bullet.TYPE].move(_this, bullet));
  };

  this.doBulletMove = function(bullet) {
    var newPosition = bullet.position.getSibling(bullet.direction);
    var mapItem = map.getItem(newPosition);

    map.move(bullet, newPosition);

    bullet.addAction(ACTIONS[Bullet.TYPE].move(_this, bullet));

    switch (mapItem.type) {
      case Map.EMPTY.type:
        return;

      case Map.OUTSIDE.type:
        map.remove(bullet);
        return;
    }

    doHit(mapItem, bullet);
  };


  // helpers

  function playTact() {
    map.getBullets().forEach(function(bullet) {
      bullet.act();
    });

    map.getBots().forEach(function(bot) {
      bot.act();
    });
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

module.exports = Combat;