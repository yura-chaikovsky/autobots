function Gameplay(options) {
  var players = [];
  var map = options.map;
  var middle = Math.floor(map[0].length / 2);
  var places = [
    { x: middle , y: 0 },
    { x: middle , y: map.length - 1 }
  ];

  if (!map) {
    throw new Error('Map is required!')
  }

  this.start = function() {
    console.log('');
    console.log('');
    console.log('Welcome to Autobots!');

    this.placePlayers();
    this.printList();
    this.drawMap();
  };

  this.addPlayer = function(autobot) {
    players.push(autobot);

    autobot.label = players.length - 1;
  };

  this.printList = function() {
    for (var i = 0; i < players.length; i++) {
      console.log(players[i].label + ' - ' + players[i].name);
    }

    console.log('------------');
  };

  this.placePlayers = function() {
    for (var i = 0; i < players.length; i++) {
      var place = places[i];

      map[place.y][place.x] = players[i];
    }
  };

  this.drawMap = function() {
    for (var y = 0; y < map.length; y++) {
      var row = map[y];
      var rowView = '|';

      for (var x = 0; x < row.length; x++) {
        rowView += row[x].label;
      }

      rowView += '|';
      console.log(rowView);
    }

    console.log((new Array(row.length + 3)).join('-'));
  }
}

module.exports = Gameplay;