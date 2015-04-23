function Position(x, y) {
  this.x = x;
  this.y = y;
}

Position.prototype.getSlug = function() {
  return '_' + this.x + '_' + this.y;
};

Position.prototype.clone = function() {
  return new Position(this.x, this.y);
};

Position.prototype.copyFrom = function(position) {
  this.x = position.x;
  this.y = position.y;
};

Position.prototype.getSibling = function(direction) {
  switch (direction) {
    case 'up':
      return new Position(this.x, this.y + 1);

    case 'down':
      return new Position(this.x, this.y - 1);

    case 'right':
      return new Position(this.x + 1, this.y);

    case 'left':
      return new Position(this.x - 1, this.y);
  }

  console.log('Unknown direction ' + direction);
};

Position.prototype.equalTo = function(other) {
  return this.x === other.x && this.y === other.y;
};

module.exports = Position;