'use strict';

var sinon = require('sinon');

var defaultField = require('./data/field-small');

var Position = require('../server/position');
var Autobot = require('../server/autobot');
var Bullet = require('../server/bullet');
var Wall = require('../server/wall');
var Map = require('../server/map');

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

module.exports.createMap = function(field) {
  return new Map(field || defaultField);
};

module.exports.createGameStub = function() {
  return {
    broadcastCombatState: sinon.spy(),
    finishCombat: sinon.spy()
  };
};