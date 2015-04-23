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
  },
  wait: function(autobot, options) {
    return {
      _name: 'wait',
      _options: options,
      execute: function() {}
    };
  }
};


function Autobot(options, game) {
  this.id = Date.now();
  this.name = options.name;
  this.direction = options.direction;
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

Autobot.prototype.getCurrentAction = function() {
  return this._actionStack.shift() || ACTIONS.wait();
};

module.exports = Autobot;