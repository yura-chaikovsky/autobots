var app = require('./app');

var game = new app.Gameplay({
  map: app.mapGenerator.generate(10, 10)
});

game.addPlayer(new app.Autobot('Me'));
game.addPlayer(new app.Autobot('Him'));

game.start();
