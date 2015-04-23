var ACTIONS = {
  move: function(autobot, options) {
    return {
      _name: 'move',
      _options: options,
      execute: function() {
        autobot._game.doAutobotMove(autobot, options);
      }
    };
  },
  fire: function(autobot, options) {
    return {
      _name: 'fire',
      _options: options,
      execute: function() {
        autobot._game.doAutobotFire(autobot, options)
      }
    };
  }
};


function Autobot(game, options) {
  this.id = Date.now();
  this.name = options.name;
  this.direction = options.direction;
  this.position = options.position;
  this.health = options.health;

  this._game = game;
  this._actionStack = [];
}

Autobot.prototype.addAction = function(action, options) {
  var command = ACTIONS[action];

  if (!command) {
    console.log('Autobot can\'t do "' + action + '" action!');

    return;
  }

  this._actionStack.push(command(this, options));
};

Autobot.prototype.moveTo = function(position) {
  this.position.x = position.x;
  this.position.y = position.y;
};

Autobot.prototype.getCurrentAction = function() {
  return this._actionStack.shift();
};

module.exports = Autobot;