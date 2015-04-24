var config = require('./config.json');
var counter = 0;

function Wall() {
  this.type = Wall.TYPE;
  this.id = Wall.TYPE + '#' + counter;
  ++counter;

  this._health = config.wall.health;
}

Wall.TYPE = 'wall';

Wall.prototype.hit = function() {
  --this._health;
};

Wall.prototype.getState = function() {
  return {
    health: this.health
  };
};

module.exports = Wall;