var config = require('./config');

var Position = require('./position');
var Autobot = require('./autobot');
var Bullet = require('./bullet');
var Wall = require('./wall');

var WALL_SYMBOL = 1;


function Map(field) {
  var _this = this;
  this._field = field;

  this.height = field.length;
  this.width = field[0].length;

  this._items = {};

  field.forEach(function(row, y) {
    row.forEach(function(cell, x) {
      var item = Map.NULL;

      if (cell === WALL_SYMBOL) {
        item = new Wall({
          health: config.wall.health
        });
      }

      _this.place(item, new Position(x, y));
    });
  });
}

Map.NULL = null;


Map.prototype.place = function(item, position) {
  this._items[position.getSlug()] = item;

  if (item) {
    item.position = position;
  }
};

Map.prototype.remove = function(item) {
  this._items[item.position.getSlug()] = Map.NULL;
};


// check methods

Map.prototype.isOnMap = function(position) {
  return position.getSlug() in this._items;
};

Map.prototype.isEmpty = function(position) {
  return this._items[position.getSlug()] === Map.NULL;
};


// getters

Map.prototype.getField = function() {
  return this._field;
};

Map.prototype.getItem = function(position) {
  return this._items[position.getSlug()];
};

Map.prototype.getItems = function() {
  return Object.keys(this._items).map(function(slug) {
    return this._items[slug];
  }, this);
};

Map.prototype.getBots = function() {
  return this.getItems().filter(function(item) {
    return item instanceof Autobot;
  });
};

Map.prototype.getBullets = function() {
  return this.getItems().filter(function(item) {
    return item instanceof Bullet;
  });
};

Map.prototype.getWalls = function() {
  return this.getItems().filter(function(item) {
    return item instanceof Wall;
  });
};

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


module.exports = Map;
