'use strict';

var Map = require('./map');
var generator = require('./labyrinth/index.js');

module.exports = {
  generate: function(options) {
    return new Map(generator.generateLabyrinth(options.height, options.width));
  }
};
