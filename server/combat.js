'use strict';

var Autobot = require('./autobot');
var Bullet = require('./bullet');
var Wall = require('./wall');
var Map = require('./map');

function Combat(config, options) {
  var _this = this;

  var map = options.map;
  var players = options.players;
  var currentTurn = 0;
  var timer;


  // manage the game

  this.start = function() {
    players.forEach(function(player) {
      player.autobot = new Autobot(options.autobotConfig, {
        playerId: player.id,
        name: player.name,
        direction: 'right'
      });

      map.add(player.autobot, map.getStartPosition());
    });

    options.game.broadcastCombatState(_this);

    timer = setInterval(function() {
      if (map.getBots().length < 2) {
        _this.stop();
      }

      ++currentTurn;
      console.log('Current turn: ' + currentTurn);

      playTact();

      options.game.broadcastCombatState(_this);
    }, config.tick);
  };

  this.stop = function() {
    clearInterval(timer);

    players.forEach(function(player) {
      player.autobot = null;
    });

    options.game.finishCombat(this);
  };

  this.addAction = function(player, actionData) {
    var bot = player.autobot;

    if (actionData.fire) {
      bot.addAction('fire', executeBotFire.bind(null, bot));
    }

    if (actionData.move) {
      bot.addAction('move', moveBot.bind(null, bot, actionData.move));
    }

    if (actionData.rotate) {
      bot.addAction('rotate', rotateBot.bind(null, bot, actionData.rotate));
    }
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
  

  this.doBulletMove = function(bullet) {
    bullet.addAction('move', this.doBulletMove.bind(this, bullet));

    moveBullet(bullet);
  };


  // helpers

  function playTact() {
    // bullets are moved before bots
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

  function rotateBot(bot, rotation) {
    bot.direction = rotation;
  }

  function executeBotFire(bot) {
    var bullet = new Bullet(options.bulletConfig, {
      direction: bot.direction,
      ownerId: bot.id
    });

    map.add(bullet, bot.position.clone());

    bullet.addAction('move', _this.doBulletMove.bind(_this, bullet));
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

  function doHit(item, bullet) {
    if (item.type === 'autobot' && item.id === bullet.ownerId) {
      return;
    }

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