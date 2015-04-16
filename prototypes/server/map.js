function Map(field) {
  this._field = field;

  this.height = field.length;
  this.width = field[0].length;
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
    { x: middle , y: 0 },
    { x: middle , y: this.height - 1 }
  ];
};

Map.prototype.isOnMap = function(x, y) {
  return this._field[y] !== undefined
    && this._field[y][x] !== undefined;
};

Map.prototype.isEmpty = function(x, y) {
  return this.isOnMap(x, y)
    && this._field[y][x] === Map.EMPTY;
};

Map.prototype.getState = function() {
  return this._field;
};

module.exports = Map;