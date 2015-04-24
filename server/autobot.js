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

var counter = 0;

function Autobot(options, game) {
  this.type= Autobot.TYPE;
  this.id = Autobot.TYPE + '#' + counter;
  ++counter;

  this.name = options.name;
  this.direction = options.direction;
  this.health = options.health;

  this._game = game;
  this._actionStack = [];
}

Autobot.TYPE = 'autobot';

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

Autobot.prototype.hit = function() {
  --this.health;

  console.log(this.name + ' (' + this.health + 'hp)');
};

Autobot.prototype.getState = function() {
  return {
    id: this.id,
    name: this.name,
    direction: this.direction,
    position: this.position.normalize(),
    health: this.health
  };
};

module.exports = Autobot;