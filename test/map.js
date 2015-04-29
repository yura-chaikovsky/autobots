var expect = require('chai').expect;
var Map = require('../server/map');
var Position = require('../server/position');
var Autobot = require('../server/autobot');
var Bullet = require('../server/bullet');
var Wall = require('../server/wall');

var field = require('./data/field');

describe('Map', function() {
  var map;

  beforeEach(function() {
    map = new Map(field);
  });

  it('should create a map', function() {
    expect(map.height).equal(11);
    expect(map.width).equal(11);

    expect(map.getBots()).length(0);
    expect(map.getBullets()).length(0);
    expect(map.getWalls()).length(49);
  });

  describe('Map.add', function() {
    it('should add bot', function() {
      var bot = new Autobot({
        name: 'Test Bot',
        playerId: 'player#1',
        direction: 'right'
      });

      map.add(bot, new Position(5, 0));

      expect(bot.position.x).equal(5);
      expect(bot.position.y).equal(0);
      expect(map.getBots()).length(1);
      expect(map.getBullets()).length(0);
      expect(map.getWalls()).length(49);
    });

    it('should add bullet', function() {
      var bullet = new Bullet({
         direction: 'right'
      });

      map.add(bullet, new Position(5, 0));

      expect(bullet.position.x).equal(5);
      expect(bullet.position.y).equal(0);
      expect(map.getBots()).length(0);
      expect(map.getBullets()).length(1);
      expect(map.getWalls()).length(49);
    });

    it('should add wall', function() {
      var wall = new Wall();

      map.add(wall, new Position(5, 0));

      expect(wall.position.x).equal(5);
      expect(wall.position.y).equal(0);
      expect(map.getBots()).length(0);
      expect(map.getBullets()).length(0);
      expect(map.getWalls()).length(50);
    });
  });

  describe('Map.isOnMap', function() {
    it('should return correct results', function() {
      expect(map.isOnMap(new Position(2, 3))).equal(true);
      expect(map.isOnMap(new Position(10, 3))).equal(true);
      expect(map.isOnMap(new Position(0, 3))).equal(true);
      expect(map.isOnMap(new Position(11, 3))).equal(false);
      expect(map.isOnMap(new Position(-1, 3))).equal(false);
      expect(map.isOnMap(new Position(2, 0))).equal(true);
      expect(map.isOnMap(new Position(2, 10))).equal(true);
      expect(map.isOnMap(new Position(2, 11))).equal(false);
      expect(map.isOnMap(new Position(2, -1))).equal(false);
      expect(map.isOnMap(new Position(0, 0))).equal(true);
      expect(map.isOnMap(new Position(10, 10))).equal(true);
    });
  });
});