function Autobot(token) {
  this.id = token;
  this.name = token;

  this._actionStack = [];

  this.position = {
    x: 0,
    y: 0
  };
}

Autobot.ACTIONS = {
  move: function(autobot, options) {
    var oldPosition = {
      x: autobot.position.x,
      y: autobot.position.y
    };

    return {
      name: 'move',
      options: options,
      execute: function() {
        switch (options.direction) {
          case 'up':
            ++autobot.position.y;
            break;

          case 'down':
            --autobot.position.y;
            break;

          case 'right':
            ++autobot.position.x;
            break;

          case 'left':
            --autobot.position.x;
            break;
        }
      },
      undo: function() {
        autobot.position.x = oldPosition.x;
        autobot.position.y = oldPosition.y;
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