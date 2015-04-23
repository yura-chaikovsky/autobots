function Wall(options) {
  this._health = options.health;
  this.position = options.position;
}

Wall.prototype.hit = function() {
  --this._health;
};

Wall.prototype.getCondition = function() {
  return this._health;
};

module.exports = Wall;