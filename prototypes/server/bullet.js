function Bullet(game, options) {
  this.id = Date.now();
  this._game = game;

  this._actionStack = [];
  this._actionStack.push(Bullet.ACTIONS.move(this));

  this.direction = options.direction;
  this.position = {};
  this.position.x = options.x;
  this.position.y = options.y;
}

Bullet.ACTIONS = {
  move: function(bullet) {
    return {
      name: 'move',
      options: options,
      execute: function() {
        var x = bullet.position.x;
        var y = bullet.position.y;

        switch (bullet.direction) {
          case 'up':
            ++y;
            break;

          case 'down':
            --y;
            break;

          case 'right':
            ++x;
            break;

          case 'left':
            --x;
            break;
        }

        this._actionStack.push(Bullet.ACTIONS.move(this));
        this._game.moveBulletTo(x, y);
      }
    };
  }
};

module.exports = Bullet;