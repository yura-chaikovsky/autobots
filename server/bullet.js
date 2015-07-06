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
    move: [doNothing]
  };
}

function doNothing() {}

Bullet.TYPE = 'bullet';

Bullet.prototype.addAction = function(action) {
  Object.keys(action).forEach(function(type) {
    var queue = this._actions[type];
    var config = this._config.actions[type];

    var resultStep = queue.length - 1 + config.result;
    var step;

    for (step = 0; step < config.duration; ++step) {
      queue.push(doNothing);
    }

    queue[resultStep] = action[type];
  }, this);
};

Bullet.prototype.act = function() {
  this._actions.move.shift()();

  this._actions.move[0] = this._actions.move[0] || doNothing;
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