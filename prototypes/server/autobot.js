function Autobot(name) {
  this.name = name;
  this.label = '@';

  this._actions = [];

  this.position = {
    x: 0,
    y: 0
  };
}

Autobot.prototype.addAction = function(action) {
  this._actions.push(action);
};

Autobot.prototype.getCurrentAction = function() {
  return this._actions.shift();
};

module.exports = Autobot;