var MapGenerator = require('./map-generator');
var Gameplay = require('./gameplay');
var Autobot = require('./autobot');
var mapGenerator = new MapGenerator();

var actions = ['', 'up', 'down', 'right', 'left'];
var game;

module.exports = {
  run: function(io) {
    if (game) {
      return;
    }

    game = new Gameplay({
      io: io,
      map: mapGenerator.generate(10, 10),
      tick: 300
    });

    var me = new Autobot('Me');
    var he = new Autobot('He');

    for (var i = 0; i < 1000; i++) {
      me.addAction(actions[Math.floor(Math.random() * 5)]);
      he.addAction(actions[Math.floor(Math.random() * 5)]);
    }

    game.addPlayer(me);
    game.addPlayer(he);

    game.start();
  }
};
