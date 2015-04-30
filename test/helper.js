var Position = require('../server/position');
var Autobot = require('../server/autobot');
var Bullet = require('../server/bullet');
var Wall = require('../server/wall');

module.exports.createBot = function(name, playerId, direction) {
  return new Autobot({
    name: name || 'Test bot',
    playerId: playerId || 'player#0',
    direction: direction || 'right'
  });
};

module.exports.createBullet = function(direction) {
  return new Bullet({
    direction: direction || 'right'
  });
};

module.exports.createWall = function() {
  return new Wall();
};

module.exports.createPosition = function(x, y) {
  return new Position(x, y);
};