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

Autobot.prototype.addAction = function(type, action) {
  var queue = this._actions[type];
  var count = this._config.duration[type] - 1;

  queue.push(action);

  for (; count > 0; --count) {
    queue.push(doNothing);
  }
};

Autobot.prototype.act = function() {
  var move = this._actions.move.shift();
  var rotate = this._actions.rotate.shift();
  var fire = this._actions.fire.shift();

  // The order is important because bullet is placed differently
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
    readyTo: {
      move: !this._actions.move[0],
      rotate: !this._actions.rotate[0],
      fire: !this._actions.fire[0]
    }
  };
};

module.exports = Autobot;