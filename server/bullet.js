var config = require('./config.json');

var counter = 0;

function Bullet(options) {
  this.type = Bullet.TYPE;
  this.id = Bullet.TYPE + '#' + counter;

  ++counter;

  this.health = 1;
  this.direction = options.direction;
  this.position = null;

  this.busyCount = 0;
  this._actionsQueue = [];
}

Bullet.TYPE = 'bullet';

Bullet.prototype.addAction = function(action) {
  this._actionsQueue.push(action);
};

Bullet.prototype.act = function() {
  var action = this._actionsQueue[0];

  --this.busyCount;

  if (!action || this.busyCount > 0 ) {
    return;
  }

  this._actionsQueue.shift();
  this.busyCount = action.duration;

  action.execute();
};

Bullet.prototype.hit = function() {
  this.health = 0;
};

Bullet.prototype.getState = function() {
  return {
    id: this.id,
    direction: this.direction,
    health: this.health,
    position: this.position.normalize(),
    busyCount: this.busyCount > 0 ? this.busyCount : 0
  };
};

module.exports = Bullet;