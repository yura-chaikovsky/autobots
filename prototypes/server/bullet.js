function Bullet(options) {
  this.id = Date.now();

  this.direction = options.direction;
}

module.exports = Bullet;