function Gameplay(options) {
  var io = options.io;
  var players = [];
  var map = options.map;
  var middle = Math.floor(map[0].length / 2);
  var places = [
    { x: middle , y: 0 },
    { x: middle , y: map.length - 1 }
  ];

  var currentTurn = 0;

  if (!map) {
    throw new Error('Map is required!')
  }

  this.start = function() {
    var _this = this;

    _this.placePlayers();

    setInterval(function() {
      currentTurn++;

      console.log('Current turn: ' + currentTurn);

      _this.update();
      _this.broadcastState();
    }, options.tick);
  };

  this.update = function() {
    players.forEach(function(player) {
      var action = player.getCurrentAction();

      console.log(player.name, ' = ', action);

      var x = player.position.x,
          y = player.position.y;

      if ('up' === action) {
        --y;
      } else if ('down' === action) {
        ++y
      } else if ('left' === action) {
        --x
      } else if ('right' === action) {
        ++x;
      }

      if (map[y] && map[y][x] && ('empty' === map[y][x].name)) {
        player.position.x = x;
        player.position.y = y;
      }
    });
  };

  this.broadcastState = function() {
    io.emit('state-update', {
      turn: currentTurn,
      map: map,
      players: players
    });
  };

  this.addPlayer = function(autobot) {
    players.push(autobot);
  };

  this.placePlayers = function() {
    for (var i = 0; i < players.length; i++) {
      players[i].position.x = places[i].x;
      players[i].position.y = places[i].y;
    }
  };
}

module.exports = Gameplay;