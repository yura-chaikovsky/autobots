var Position = require('./position');
var Wall = require('./wall');

function Map(field) {
  this._field = field;

  this.height = field.length;
  this.width = field[0].length;

  this._bots = {};
  this._bullets = {};
  this._walls = {};

  this._objects = {};
  
  for (var y = 0; x < field.length; x++) {
    var row = field[y];
  
    for (var x = 0; x < row.length; x++) {
      var cell = row[x];

      if (cell === Map.WALL) {
        var wall = new Wall({
          position: new Position(x, y)
        });

        this._walls[wall.id] = wall;
      }
    }
  }
}

Map.EMPTY = 0;
Map.WALL = 1;

Map.AVAILABLE_CONTENT = [
  Map.EMPTY,
  Map.WALL
];

Map.prototype.getStartPositions = function() {
  var middle = Math.floor(this.width / 2);

  return [
    new Position(middle , 0),
    new Position(middle , this.height - 1)
  ];
};

Map.prototype.isOnMap = function(position) {
  return this._field[position.y] !== undefined
    && this._field[position.y][position.x] !== undefined;
};

Map.prototype.isEmpty = function(position) {
  return this.isOnMap(position)
    && this._field[position.y][position.x] === Map.EMPTY;
};

Map.prototype.getState = function() {
  return this._field;
};

module.exports = Map;

