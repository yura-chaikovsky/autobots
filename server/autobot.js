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
    move: [],
    rotate: [],
    fire: []
  };
}

function doNothing() {}

Autobot.TYPE = 'autobot';

Autobot.prototype.addAction = function(action) {
  var configs = this._config.actions;
  var actions = this._actions;

  Object.keys(action).forEach(function(type) {
    var step;

    if (!actions[type].length) {
      actions[type].push(doNothing);
    }

    var resultStep = actions[type].length - 1 + configs[type].result;

    for (step = 0; step < configs[type].duration; ++step) {
      actions[type].push(doNothing);
    }

    actions[type][resultStep] = action[type];
  }, this);
};

Autobot.prototype.act = function() {
  var move = this._actions.move.shift();
  var rotate = this._actions.rotate.shift();
  var fire = this._actions.fire.shift();

  if (fire) {
    fire();
  }

  if (move) {
    move();
  }

  if (rotate) {
    rotate();
  }
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
    schedule: {
      move: this._actions.move.length,
      rotate: this._actions.rotate.length,
      fire: this._actions.fire.length
    }
  };
};

module.exports = Autobot;