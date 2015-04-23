function Wall(options) {
  this._health = 2;
  this.position = options.position;
}

Wall.prototype.hit = function() {
  --this._health;
};

Wall.prototype.getCondition = function() {
  return this._health;
};

module.exports = Wall;