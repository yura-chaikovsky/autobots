'use strict';

var Position = require('./position');
var Autobot = require('./autobot');
var Bullet = require('./bullet');
var Wall = require('./wall');

var EMPTY_SYMBOL = '0';
var WALL_SYMBOL = '1';

/**
 * Creates map using for given field
 *
 * @param field
 * @constructor
 */
function Map(config, options) {
  this._labyrinth = options.labyrinth;

  this.height = options.labyrinth.length;
  this.width = options.labyrinth[0].length;

  this._cache = {};
  this._cache[Autobot.TYPE] = {};
  this._cache[Bullet.TYPE] = {};
  this._cache[Wall.TYPE] = {};

  options.labyrinth.forEach(function(row, y) {
    row.forEach(function(cell, x) {
      if (cell === WALL_SYMBOL) {
        this.add(new Wall(options.wallConfig), new Position(x, y));
      }
    }, this);
  }, this);
}

Map.EMPTY = {
  type: 'empty'
};

Map.OUTSIDE = {
  type: 'outside'
};

/**
 * Returns an items cache basing on item.type
 *
 * @param {Autobot|Bullet|Wall} item
 * @returns {*}
 * @private
 */
Map.prototype._getCollection = function(item) {
  return this._cache[item.type];
};

/**
 * Puts the item to given position on the map
 *
 * @param {Autobot|Bullet|Wall} item
 * @param {Position} position
 */
Map.prototype.add = function(item, position) {
  if (this.isExist(item)) {
    return;
  }

  item.position = position;
  this._getCollection(item)[position.getSlug()] = item;
};

/**
 * Moves the item to the given position
 *
 * @param {Autobot|Bullet|Wall} item
 * @param {Position} position
 */
Map.prototype.move = function(item, position) {
  if (!this.isExist(item)) {
    return;
  }

  this.remove(item);
  this.add(item, position);
};

/**
 * Removes the item from the map
 *
 * @param {Autobot|Bullet|Wall} item
 */
Map.prototype.remove = function(item) {
  if (!this.isExist(item)) {
    return;
  }

  delete this._getCollection(item)[item.position.getSlug()];
};

// check methods

/**
 * Checks whether given position is inside the map
 *
 * @param {Position} position
 * @returns {boolean}
 */
Map.prototype.isOnMap = function(position) {
  var row = this._labyrinth[position.y];

  return !!(row && row[position.x]);
};

/**
 * Returns map item at given position
 *
 * @param {Position} position
 * @returns {Autobot|Bullet|Wall|Map.EMPTY|Map|OUTSIDE}
 */
Map.prototype.getItem = function(position) {
  var slug = position.getSlug();

  if (!this.isOnMap(position)) {
    return Map.OUTSIDE;
  }

  return this._cache[Wall.TYPE][slug]
    || this._cache[Bullet.TYPE][slug]
    || this._cache[Autobot.TYPE][slug]
    || Map.EMPTY;
};

/**
 * Checks if map does not have items at given position
 *
 * @param {Position} position
 * @returns {boolean}
 */
Map.prototype.isEmpty = function(position) {
  return this.getItem(position) === Map.EMPTY;
};

/**
 * Checks if the item exists on the map
 *
 * @param {Autobot|Bullet|Wall} item
 * @returns {boolean}
 */
Map.prototype.isExist = function(item) {
  if (!item.position) {
    return false;
  }

  return item === this._getCollection(item)[item.position.getSlug()];
};


// getters

/**
 * Returns 2D representation of a map with walls on it
 *
 * @returns {Array[]}
 */
Map.prototype.getField = function() {
  return this._labyrinth.map(function(row, y) {
    return row.map(function(cell, x) {
      return this._cache[Wall.TYPE][Position.generateSlug(x, y)];
    }, this);
  }, this);
};

/**
 * Returns all bots on the map
 *
 * @returns {Autobot[]}
 */
Map.prototype.getBots = function() {
  return getAsArray(this._cache[Autobot.TYPE]);
};

/**
 * Returns all bullets on the map
 *
 * @returns {Bullet[]}
 */
Map.prototype.getBullets = function() {
  return getAsArray(this._cache[Bullet.TYPE]);
};

/**
 * Returns all walls on the map
 *
 * @returns {Wall[]}
 */
Map.prototype.getWalls = function() {
  return getAsArray(this._cache[Wall.TYPE]);
};


// helpers

/**
 * Generates a position to place ne bot
 *
 * @returns {Position}
 */
Map.prototype.getStartPosition = function() {
  var numberOfPlayers = this.getBots().length;
  var rowNumber = (numberOfPlayers % 2) * (this.height - 1);
  var middle = Math.floor(this.width / 2);

  var position = new Position(middle, rowNumber);

  while (!this.isEmpty(position)) {
    position = position.getSibling('right')
  }

  return position;
};

/**
 * Converts hash object to an array
 *
 * @param {Object} collection
 * @returns {Array.<T>}
 */
function getAsArray(collection) {
  return Object.keys(collection).map(function(slug) {
    return collection[slug];
  }).sort(function(a, b) {
    return a.id > b.id;
  });
}

module.exports = Map;
