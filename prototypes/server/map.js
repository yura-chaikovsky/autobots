function Map(field) {
  this._field = field;

  this.height = field.length;
  this.width = field[0].length;

  var middle = Math.floor(this.width / 2);

  this.startPoritions = [
    { x: middle , y: 0 },
    { x: middle , y: this.height - 1 }
  ];
}

Map.EMPTY = 0;
Map.WALL = 1;

Map.AVAILABLE_CONTENT = [
  Map.EMPTY,
  Map.WALL
];

Map.prototype.isOnMap = function(x, y) {
  return this._field[y] != undefined
    && this._field[y][x] != undefined;
};

Map.prototype.getMapObject = function(x, y) {
  if (this.isOnMap(x, y)) {
    return this._field[y][x];
  }
};

Map.prototype.isEmpty = function(x, y) {
  return this.isOnMap(x, y)
    && this._field[y][x] === Map.EMPTY;
};

Map.prototype.getState = function() {
  return this._field;
};

module.exports = Map;