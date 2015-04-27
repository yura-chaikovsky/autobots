var config = require('./config.json');

var counter = 0;

function Autobot(options) {
  this.type= Autobot.TYPE;
  this.id = Autobot.TYPE + '#' + counter;
  this.busyCount = 0;

  ++counter;

  this.name = options.name;
  this.direction = options.direction;
  this.health = config.autobot.health;
}

Autobot.TYPE = 'autobot';


Autobot.prototype.hit = function() {
  --this.health;

  console.log(this.name + ' (' + this.health + 'hp)');
};

Autobot.prototype.getState = function() {
  return {
    id: this.id,
    name: this.name,
    direction: this.direction,
    health: this.health,
    position: this.position.normalize(),
    busyCount: this.busyCount > 0 ? this.busyCount : 0
  };
};

module.exports = Autobot;