var mapItems = [
  { name: 'empty', label: ' ' },
  { name: 'wall', label: 'X' }
];

function MapGenerator() {}

MapGenerator.prototype.generate = function(width, height) {
  var map = [];

  for (var y = 0; y < height; y++) {
    var row = [];

    map.push(row);

    for (var x = 0; x < width; x++) {
      row.push( getRandomObject() );
    }
  }

  return map;
};

function getRandomObject() {
  var n = Math.random() * 10;
  var position = (n > 8) ? 1 : 0;

  return mapItems[position];
}

module.exports = MapGenerator;