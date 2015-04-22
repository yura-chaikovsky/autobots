function Bullet(options) {
  this.id = Date.now();

  this.direction = options.direction;
  this.position = {};
  this.position.x = options.x;
  this.position.y = options.y;
}

module.exports = Bullet;