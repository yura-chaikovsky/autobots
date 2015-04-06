var Map = require('./map');

function MapGenerator() {}

MapGenerator.prototype.generate = function(width, height) {
  var field = [];

  for (var y = 0; y < height; y++) {
    var row = [];

    field.push(row);

    for (var x = 0; x < width; x++) {
      row.push( getRandomObject() );
    }
  }

  return new Map(field);
};

function getRandomObject() {
  var n = Math.random() * 10;
  var position = (n > 8) ? 1 : 0;

  return Map.AVAILABLE_CONTENT[position];
}

module.exports = MapGenerator;