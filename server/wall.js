'use strict';

var counter = 0;

function Wall(config) {
  this.type = Wall.TYPE;
  this.id = Wall.TYPE + '#' + counter;

  ++counter;

  this.health = config.health;
}

Wall.TYPE = 'wall';

Wall.prototype.hit = function() {
  --this.health;
};

Wall.prototype.getState = function() {
  return {
    id: this.id,
    position: this.position.normalize(),
    health: this.health
  };
};

module.exports = Wall;