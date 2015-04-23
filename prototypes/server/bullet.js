function Bullet(options) {
  this.id = Date.now();

  this.direction = options.direction;
  this.position = options.position;
}

module.exports = Bullet;