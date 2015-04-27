var config = require('./config');

var Position = require('./position');
var Autobot = require('./autobot');
var Bullet = require('./bullet');
var Wall = require('./wall');

var EMPTY_SYMBOL = '0';
var WALL_SYMBOL = '1';


function Map(field) {
  this._initialField = field;

  this.height = field.length;
  this.width = field[0].length;

  this._bots = {};
  this._bullets = {};
  this._walls = {};

  this._cache = {};
  this._cache[Autobot.TYPE] = {};
  this._cache[Bullet.TYPE] = {};
  this._cache[Wall.TYPE] = {};

  field.forEach(function(row, y) {
    row.forEach(function(cell, x) {
      if (cell === WALL_SYMBOL) {
        this.add(new Wall(this), new Position(x, y));
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

Map.prototype._getCollection = function(item) {
  return this._cache[item.type];
};

Map.prototype.add = function(item, position) {
  item.position = position;
  this._getCollection(item)[position.getSlug()] = item;
};

Map.prototype.move = function(item, position) {
  this.remove(item);
  this.add(item, position);
};

Map.prototype.remove = function(item) {
  delete this._getCollection(item)[item.position.getSlug()];
};

// check methods

Map.prototype.isOnMap = function(position) {
  var row = this._initialField[position.y];

  return row && row[position.x];
};

Map.prototype.getItem = function(position) {
  var slug = position.getSlug();

  if (!this.isOnMap(position)) {
    return Map.OUTSIDE;
  }

  return this._cache[Wall.TYPE][slug]
    || this._cache[Autobot.TYPE][slug]
    || this._cache[Bullet.TYPE][slug]
    || Map.EMPTY;
};

Map.prototype.isEmpty = function(position) {
  return this.getItem(position) === Map.EMPTY;
};


// getters

Map.prototype.getField = function() {
  var wallsCache = this._cache[Wall.TYPE];

  return this._initialField.map(function(row, y) {
    return row.map(function(cell, x) {
      return wallsCache[Position.generateSlug(x, y)];
    });
  });
};

Map.prototype.getBots = function() {
  return getAsArray(this._cache[Autobot.TYPE]);
};

Map.prototype.getBullets = function() {
  return getAsArray(this._cache[Bullet.TYPE]);
};

Map.prototype.getWalls = function() {
  return getAsArray(this._cache[Wall.TYPE]);
};


// helpers

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


function getAsArray(collection) {
  return Object.keys(collection).map(function(slug) {
    return collection[slug];
  }).sort(function(a, b) {
    return a.id > b.id;
  });
}

module.exports = Map;
