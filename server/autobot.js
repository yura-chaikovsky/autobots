'use strict';

var counter = 0;

function Autobot(config, options) {
  this.type= Autobot.TYPE;
  this.id = Autobot.TYPE + '#' + counter;

  ++counter;

  this._config = config;
  this.playerId = options.playerId;
  this.name = options.name;
  this.direction = options.direction;
  this.position = null;

  this.health = config.health;

  this._actions = {
    move: [doNothing],
    rotate: [doNothing],
    fire: [doNothing]
  };
}

function doNothing() {}

Autobot.TYPE = 'autobot';

Autobot.prototype.addAction = function(action) {
  Object.keys(action).forEach(function(type) {
    var queue = this._actions[type];
    var config = this._config.actions[type];

    var resultStep = queue.length - 1 + config.result;
    var step;

    for (step = 0; step < config.duration; ++step) {
      queue.push(doNothing);
    }

    queue[resultStep] = action[type];
  }, this);
};

Autobot.prototype.act = function() {
  this._actions.fire.shift()();
  this._actions.move.shift()();
  this._actions.rotate.shift()();

  this._actions.fire[0] = this._actions.fire[0] || doNothing;
  this._actions.move[0] = this._actions.move[0] || doNothing;
  this._actions.rotate[0] = this._actions.rotate[0] || doNothing;
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
    readyTo: {
      move: this._actions.move.length < 2,
      rotate: this._actions.rotate.length < 2,
      fire: this._actions.fire.length < 2
    }
  };
};

module.exports = Autobot;