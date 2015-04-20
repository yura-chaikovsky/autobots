var Map = require('./map');
var generator = require('../../server/labyrinth/index.js');

module.exports = {
  generate: function(width, height) {
    return new Map(generator.generateLabyrinth(height, width));
  }
};
