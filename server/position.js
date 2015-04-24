function Position(x, y) {
  this.x = x;
  this.y = y;
}


// static methods

Position.generateSlug = function(x, y) {
  return '_' + x + '_' + y;
};


// methods

Position.prototype.getSlug = function() {
  return Position.generateSlug(this.x, this.y);
};

Position.prototype.clone = function() {
  return new Position(this.x, this.y);
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

Position.prototype.toString = function() {
  return '(' + this.x + ', ' + this.y + ')';
};

Position.prototype.normalize = function() {
  return {
    x: this.x,
    y: this.y
  };
};

module.exports = Position;