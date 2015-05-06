'use strict';

var Map = require('./map');
var labyrinthGenerator = require('./labyrinth/index.js');

module.exports = {
  generate: function(config) {
    return new Map(config.map, {
      wallConfig: config.wall,
      labyrinth: labyrinthGenerator.generateLabyrinth(config.map.height, config.map.width)
    });
  }
};
