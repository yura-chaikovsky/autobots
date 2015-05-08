'use strict';

var sinon = require('sinon');

var defaultField = require('./data/field-small');
var config = require('./data/config');

var Position = require('../server/position');
var Autobot = require('../server/autobot');
var Bullet = require('../server/bullet');
var Wall = require('../server/wall');
var Map = require('../server/map');

var clock;

module.exports.createBot = function(name, playerId, direction) {
  return new Autobot(config.autobot, {
    name: name || 'Test bot',
    playerId: playerId || 'player#0',
    direction: direction || 'right'
  });
};

module.exports.createBullet = function(direction) {
  return new Bullet(config.bullet, {
    direction: direction || 'right'
  });
};

module.exports.createWall = function() {
  return new Wall(config.wall);
};

module.exports.createPosition = function(x, y) {
  return new Position(x, y);
};

module.exports.createMap = function(field) {
  return new Map(config.map, {
    labyrinth: field || defaultField,
    wallConfig: config.wall
  });
};

module.exports.createGameStub = function() {
  return {
    broadcastCombatState: sinon.spy(),
    finishCombat: sinon.spy()
  };
};

module.exports.timer = {
  initialize: function() {
    clock = sinon.useFakeTimers();
  },
  start: function() {
    clock.tick(10);
  },
  tick: function(numberOfTurns) {
    clock.tick(numberOfTurns * config.combat.tick);
  },
  nextTurn: function() {
    this.tick(1);
  },
  waitForResult: function(action) {
    this.tick(config.autobot.actions[action].result);
  },
  waitBeforeReady: function(action) {
    this.tick(config.autobot.actions[action].duration - 1);
  },
  waitForReady: function(action) {
    this.waitBeforeReady(action);
    this.nextTurn();
  },
  reset: function() {
    clock.restore();
  }
};