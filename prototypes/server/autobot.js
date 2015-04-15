function Autobot(name) {
  this.id = Date.now();
  this.name = name || '#' + this.id;

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