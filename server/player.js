var config = require('./config.json');
var ACTIONS = {
  move: function(player, options) {
    return {
      _name: 'move',
      _options: options,
      duration: config.autobot.moveDuration,
      execute: function() {
        player._game.doAutobotMove(player.autobot, options);
      }
    };
  },
  fire: function(player, options) {
    return {
      _name: 'fire',
      _options: options,
      duration: config.autobot.fireDuration,
      execute: function() {
        player._game.doAutobotFire(player.autobot, options)
      }
    };
  },
  wait: function(player, options) {
    return {
      _name: 'wait',
      _options: options,
      duration: 0,
      execute: function() {}
    };
  }
};

function Player(token, game) {
  this.token = token;

  this._game = game;
  this._actionsQueue = [];
}

Player.prototype.addAction = function(action, options) {
  var command = ACTIONS[action];

  if (!command) {
    console.log('Autobot can\'t do "' + action + '" action!');

    return;
  }

  this._actionsQueue.push(command(this, options));
};

Player.prototype.getCurrentAction = function() {
  return this._actionsQueue.shift() || ACTIONS.wait(this);
};

module.exports = Player;