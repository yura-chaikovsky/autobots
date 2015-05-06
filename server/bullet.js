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

Bullet.TYPE = 'bullet';

Bullet.prototype.addAction = function(type, action) {
  var queue = this._actions[type];
  var count = this._config.duration[type] - 1;

  queue.push(action);

  for (; count > 0; --count) {
    queue.push(null);
  }
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