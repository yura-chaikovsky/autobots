var config = require('./config.json');

var counter = 0;

function Autobot(options) {
  this.type= Autobot.TYPE;
  this.id = Autobot.TYPE + '#' + counter;
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
    position: this.position.normalize(),
    health: this.health
  };
};

module.exports = Autobot;