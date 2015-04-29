var config = require('./config.json');

var counter = 0;

function Autobot(options) {
  this.type= Autobot.TYPE;
  this.id = Autobot.TYPE + '#' + counter;

  ++counter;

  this.playerId = options.playerId;
  this.name = options.name;
  this.direction = options.direction;
  this.position = null;

  this.health = config.autobot.health;

  this.busyCount = 0;
  this._actionsQueue = [];
}

Autobot.TYPE = 'autobot';

Autobot.prototype.addAction = function(action) {
  this._actionsQueue.push(action);
};

Autobot.prototype.act = function() {
  var action = this._actionsQueue[0];

  --this.busyCount;

  if (!action || this.busyCount > 0 ) {
    return;
  }

  this._actionsQueue.shift();
  this.busyCount = action.duration;

  action.execute();
};

Autobot.prototype.hit = function() {
  --this.health;

  console.log(this.name + ' (' + this.health + 'hp)');
};

Autobot.prototype.getState = function() {
  return {
    id: this.id,
    playerId: this.playerId,
    name: this.name,
    direction: this.direction,
    health: this.health,
    position: this.position.normalize(),
    busyCount: this.busyCount > 0 ? this.busyCount : 0
  };
};

module.exports = Autobot;