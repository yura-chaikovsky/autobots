'use strict';

var counter = 0;

function Bullet(config, options) {
  this.type = Bullet.TYPE;
  this.id = Bullet.TYPE + '#' + counter;

  ++counter;

  this._config = config;
  this.health = 1;
  this.direction = options.direction;
  this.ownerId = options.ownerId;
  this.position = null;

  this._actions = {
    move: []
  };
}

function doNothing() {}

Bullet.TYPE = 'bullet';

Bullet.prototype.addAction = function(action) {
  var configs = this._config.actions;
  var actions = this._actions;

  Object.keys(action).forEach(function(type) {
    var step;

    if (!actions[type].length) {
      actions[type].push(doNothing);
    }

    var resultStep = actions[type].length - 1 + configs[type].result;

    for (step = 0; step < configs[type].duration; ++step) {
      actions[type].push(doNothing);
    }

    actions[type][resultStep] = action[type];
  }, this);
};

Bullet.prototype.act = function() {
  var move = this._actions.move.shift();

  if (move) {
    move();
  }
};

Bullet.prototype.hit = function() {
  this.health = 0;
};

Bullet.prototype.getState = function() {
  return {
    id: this.id,
    direction: this.direction,
    health: this.health,
    position: this.position.normalize()
  };
};

module.exports = Bullet;