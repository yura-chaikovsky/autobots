'use strict';

var Map = require('./map');

var Autobot = require('./autobot');
var Bullet = require('./bullet');
var Wall = require('./wall');

function ActionHandler(options) {
  var _this = this;
  var config = options.globalConfig;

  var map = options.map;

  var actionMap = {
    autobot: {
      rotate: doBotRotate,
      move: doBotMove,
      fire: doBotFire
    },
    bullet: {
      move: doBulletMove
    }
  };

  this.getAction = function(item, type, data) {
    if (item.type && actionMap[item.type] && actionMap[item.type][type]) {
      return actionMap[item.type][type].bind(this, item, data);
    }

    return null;
  };

  function doBotMove(bot, direction) {
    var newPosition = bot.position.getSibling(direction);
    var mapItem = map.getItem(newPosition);

    switch (mapItem.type) {
      case Map.OUTSIDE.type:
      case Autobot.TYPE:
      case Wall.TYPE:
        return;

      case Bullet.TYPE:
        map.move(bot, newPosition);
        calculateHit(bot, mapItem);
        return;

      case Map.EMPTY.type:
        map.move(bot, newPosition);
        return;
    }
  }

  function doBotRotate(bot, rotation) {
    bot.direction = rotation;
  }

  function doBotFire(bot) {
    var bullet = new Bullet(config.bullet, {
      direction: bot.direction,
      ownerId: bot.id
    });

    map.add(bullet, bot.position.clone());

    bullet.addAction({ 'move': _this.getAction(bullet, 'move', bullet.direction) });
  }

  function doBulletMove(bullet) {
    var newPosition = bullet.position.getSibling(bullet.direction);
    var mapItem = map.getItem(newPosition);

    bullet.addAction({ 'move': _this.getAction(bullet, 'move', bullet.direction) });

    map.move(bullet, newPosition);

    switch (mapItem.type) {
      case Map.EMPTY.type:
        return;

      case Map.OUTSIDE.type:
        map.remove(bullet);
        return;
    }

    calculateHit(mapItem, bullet);
  }

  function calculateHit(item, bullet) {
    if (item.type === 'autobot' && item.id === bullet.ownerId) {
      return;
    }

    map.remove(bullet);
    item.hit();

    if (item.getState().health <= 0) {
      map.remove(item);
    }
  }
}



module.exports = ActionHandler;
