function Autobot(game, options) {
  this.id = Date.now();
  this.name = options.name;

  this._game = game;

  this._actionStack = [];

  this.direction = 'up';
  this.position = {
    x: 0,
    y: 0
  };
}

Autobot.ACTIONS = {
  move: function(autobot, options) {
    return {
      name: 'move',
      options: options,
      execute: function() {
        var x = autobot.position.x;
        var y = autobot.position.y;

        switch (options.direction) {
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

        autobot._game.moveAutobotTo({
          autobot: autobot,
          x: x,
          y: y
        });
      }
    };
  },
  fire: function(autobot) {
    return {
      execute: function() {
        autobot._game.createBullet({
          direction: autobot.direction,
          x: autobot.position.x,
          y: autobot.position.y
        })
      }
    };
  }
};

Autobot.prototype.addAction = function(action, options) {
  var command = Autobot.ACTIONS[action];

  if (!command) {
    console.log('Autobot can\'t do "' + action + '" action!');
  }

  this._actionStack.push(command(this, options));
};

Autobot.prototype.getCurrentAction = function() {
  return this._actionStack.shift();
};

module.exports = Autobot;