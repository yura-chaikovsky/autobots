var config = require('./config.json');

var counter = 0;

function Bullet(options) {
  this.type = Bullet.TYPE;
  this.id = Bullet.TYPE + '#' + counter;
  this._actionTimer = 0;

  ++counter;

  this.health = 1;
  this.direction = options.direction;
}

Bullet.TYPE = 'bullet';
Bullet.moveDuration = config.bullet.moveDuration;

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