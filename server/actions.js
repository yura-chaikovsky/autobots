var config = require('./config.json');
var Autobot = require('./autobot');
var Bullet = require('./bullet');

module.exports[Autobot.TYPE] = {
  move: function(combat, autobot, options) {
    return {
      duration: config.autobot.moveDuration,
      execute: function() {
        combat.doAutobotMove(autobot, options);
      }
    };
  },
  fire: function(combat, autobot, options) {
    return {
      duration: config.autobot.fireDuration,
      execute: function() {
        combat.doAutobotFire(autobot, options)
      }
    };
  }
};

module.exports[Bullet.TYPE] = {
  move: function(combat, bullet) {
    return {
      duration: config.bullet.moveDuration,
      execute: function() {
        combat.doBulletMove(bullet);
      }
    };
  }
};
