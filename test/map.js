var expect = require('chai').expect;
var helper = require('./helper');

var Map = require('../server/map');
var Position = require('../server/position');
var Autobot = require('../server/autobot');
var Bullet = require('../server/bullet');
var Wall = require('../server/wall');

var field = require('./data/field');
var emptyField = require('./data/empty-field');

describe('Map', function() {
  var map;
  var posA;
  var posB;

  beforeEach(function() {
    map = new Map(emptyField);
    posA = new Position(5, 0);
    posB = new Position(5, 10);
  });

  describe('Map creation', function() {
    it('should create empty map', function() {
      var newMap = new Map(emptyField);

      expect(newMap.height).equal(11);
      expect(newMap.width).equal(11);

      expect(newMap.getBots()).length(0);
      expect(newMap.getBullets()).length(0);
      expect(newMap.getWalls()).length(0);
    });

    it('should prefill the map with initial walls', function() {
      var newMap = new Map(field);

      expect(newMap.height).equal(11);
      expect(newMap.width).equal(11);

      expect(newMap.getBots()).length(0);
      expect(newMap.getBullets()).length(0);
      expect(newMap.getWalls()).length(49);
    });
  });

  describe('Map add, move and remove', function() {
    describe('Map bots', function() {
      var bot1;
      var bot2;

      beforeEach(function() {
        bot1 = helper.createBot('Test bot 1');
        bot2 = helper.createBot('Test bot 2');
      });

      it('should add only new bots', function() {
        expect(map.isExist(bot1)).equal(false);
        expect(map.isExist(bot2)).equal(false);
        expect(map.isEmpty(posA)).equal(true);

        map.add(bot1, posA);

        expect(map.isExist(bot1)).equal(true);
        expect(map.isExist(bot2)).equal(false);
        expect(map.isEmpty(posA)).equal(false);
        expect(map.getItem(posA)).equal(bot1);

        expect(bot1.position.x).equal(5);
        expect(bot1.position.y).equal(0);

        expect(map.getBots()).length(1);
        expect(map.getBullets()).length(0);
        expect(map.getWalls()).length(0);

        map.add(bot1, posB);

        expect(map.getBots()).length(1);
        expect(map.isEmpty(posB)).equal(true);
        expect(map.getItem(posA)).equal(bot1);

        map.add(bot2, posB);

        expect(map.getBots()).length(2);
      });

      it('should remove only existent bots', function() {
        map.add(bot1, posA);
        map.remove(bot2);

        expect(map.getBots()).length(1);
        expect(map.isExist(bot1)).equal(true);
        expect(map.isEmpty(posA)).equal(false);

        map.remove(bot1);

        expect(map.getBots()).length(0);
        expect(map.isExist(bot1)).equal(false);
        expect(map.isEmpty(posA)).equal(true);
      });

      it('should replace a bot and remove existent bots', function() {
        map.add(bot1, posA);
        map.add(bot2, posA);

        expect(map.getBots()).length(1);
        expect(map.getItem(posA)).equal(bot2);
        expect(map.isExist(bot1)).equal(false);
        expect(map.isExist(bot2)).equal(true);

        map.remove(bot1);

        expect(map.getBots()).length(1);
        expect(map.getItem(posA)).equal(bot2);

        map.remove(bot2);

        expect(map.getBots()).length(0);
        expect(map.isEmpty(posA)).equal(true);
        expect(map.isExist(bot1)).equal(false);
        expect(map.isExist(bot2)).equal(false);
      });

      it('should move bots', function() {
        map.add(bot1, posA);
        map.move(bot1, posB);

        expect(map.isEmpty(posA)).equal(true);
        expect(map.getItem(posB)).equal(bot1);
      });

      it('should replace bots on move', function() {
        map.add(bot1, posA);
        map.add(bot2, posB);
        map.move(bot1, posB);

        expect(map.getBots()).length(1);
      });
    });

    describe('Map bullets', function() {
      var bullet1;
      var bullet2;

      beforeEach(function() {
        bullet1 = helper.createBullet();
        bullet2 = helper.createBullet();
      });

      it('should add only new bullets', function() {
        expect(map.isExist(bullet1)).equal(false);
        expect(map.isExist(bullet2)).equal(false);
        expect(map.isEmpty(posA)).equal(true);

        map.add(bullet1, posA);

        expect(map.isExist(bullet1)).equal(true);
        expect(map.isExist(bullet2)).equal(false);
        expect(map.isEmpty(posA)).equal(false);
        expect(map.getItem(posA)).equal(bullet1);

        expect(bullet1.position.x).equal(5);
        expect(bullet1.position.y).equal(0);

        expect(map.getBots()).length(0);
        expect(map.getBullets()).length(1);
        expect(map.getWalls()).length(0);

        map.add(bullet1, posB);

        expect(map.getBullets()).length(1);
        expect(map.isEmpty(posB)).equal(true);
        expect(map.getItem(posA)).equal(bullet1);

        map.add(bullet2, posB);

        expect(map.getBullets()).length(2);
      });

      it('should remove only existent bullets', function() {
        map.add(bullet1, posA);
        map.remove(bullet2);

        expect(map.getBullets()).length(1);
        expect(map.isExist(bullet1)).equal(true);
        expect(map.isEmpty(posA)).equal(false);

        map.remove(bullet1);

        expect(map.getBullets()).length(0);
        expect(map.isExist(bullet1)).equal(false);
        expect(map.isEmpty(posA)).equal(true);
      });

      it('should replace a bullet and remove existent bullets', function() {
        map.add(bullet1, posA);
        map.add(bullet2, posA);

        expect(map.getBullets()).length(1);
        expect(map.getItem(posA)).equal(bullet2);
        expect(map.isExist(bullet1)).equal(false);
        expect(map.isExist(bullet2)).equal(true);

        map.remove(bullet1);

        expect(map.getBullets()).length(1);
        expect(map.getItem(posA)).equal(bullet2);

        map.remove(bullet2);

        expect(map.getBullets()).length(0);
        expect(map.isEmpty(posA)).equal(true);
        expect(map.isExist(bullet1)).equal(false);
        expect(map.isExist(bullet2)).equal(false);
      });

      it('should move bullets', function() {
        map.add(bullet1, posA);
        map.move(bullet1, posB);

        expect(map.isEmpty(posA)).equal(true);
        expect(map.getItem(posB)).equal(bullet1);
      });

      it('should replace bullets on move', function() {
        map.add(bullet1, posA);
        map.add(bullet2, posB);
        map.move(bullet1, posB);

        expect(map.getBullets()).length(1);
      });
    });

    describe('Map walls', function() {
      var wall1;
      var wall2;

      beforeEach(function() {
        wall1 = new Wall();
        wall2 = new Wall();
      });

      it('should add only new walls', function() {
        expect(map.isExist(wall1)).equal(false);
        expect(map.isExist(wall2)).equal(false);
        expect(map.isEmpty(posA)).equal(true);

        map.add(wall1, posA);

        expect(map.isExist(wall1)).equal(true);
        expect(map.isExist(wall2)).equal(false);
        expect(map.isEmpty(posA)).equal(false);
        expect(map.getItem(posA)).equal(wall1);

        expect(wall1.position.x).equal(5);
        expect(wall1.position.y).equal(0);

        expect(map.getBots()).length(0);
        expect(map.getBullets()).length(0);
        expect(map.getWalls()).length(1);

        map.add(wall1, posB);

        expect(map.getWalls()).length(1);
        expect(map.isEmpty(posB)).equal(true);
        expect(map.getItem(posA)).equal(wall1);

        map.add(wall2, posB);

        expect(map.getWalls()).length(2);
      });

      it('should remove only existent walls', function() {
        map.add(wall1, posA);
        map.remove(wall2);

        expect(map.getWalls()).length(1);
        expect(map.isExist(wall1)).equal(true);
        expect(map.isEmpty(posA)).equal(false);

        map.remove(wall1);

        expect(map.getWalls()).length(0);
        expect(map.isExist(wall1)).equal(false);
        expect(map.isEmpty(posA)).equal(true);
      });

      it('should replace a wall and remove existent walls', function() {
        map.add(wall1, posA);
        map.add(wall2, posA);

        expect(map.getWalls()).length(1);
        expect(map.getItem(posA)).equal(wall2);
        expect(map.isExist(wall1)).equal(false);
        expect(map.isExist(wall2)).equal(true);
        
        map.remove(wall1);

        expect(map.getWalls()).length(1);
        expect(map.getItem(posA)).equal(wall2);
        
        map.remove(wall2);

        expect(map.getWalls()).length(0);
        expect(map.isEmpty(posA)).equal(true);
        expect(map.isExist(wall1)).equal(false);
        expect(map.isExist(wall2)).equal(false);
      });
    });
    
    describe('Map all items', function() {
      var bot1;
      var bot2;
      var bullet1;
      var bullet2;
      var wall1;
      var wall2;

      beforeEach(function() {
        bot1 = helper.createBot('Test bot 1');
        bot2 = helper.createBot('Test bot 2');
        bullet1 = helper.createBullet();
        bullet2 = helper.createBullet();
        wall1 = new Wall();
        wall2 = new Wall();
      });

      it('should place items to different layers', function() {
        map.add(bot1, posA);
        map.add(bullet1, posA);
        map.add(wall1, posA);

        expect(map.isExist(bot1)).equal(true);
        expect(map.isExist(bullet1)).equal(true);
        expect(map.isExist(wall1)).equal(true);
      });

      it('should return items in correct order', function() {
        map.add(bot1, posA);

        expect(map.getItem(posA)).equal(bot1);

        map.add(bullet1, posA);

        expect(map.getItem(posA)).equal(bullet1);

        map.add(wall1, posA);

        expect(map.getItem(posA)).equal(wall1);
      });

      it('should delete items separately', function() {
        map.add(bot1, posA);
        map.add(bullet1, posA);
        map.add(wall1, posA);

        map.remove(bot1);

        expect(map.isExist(bot1)).equal(false);
        expect(map.isExist(bullet1)).equal(true);
        expect(map.isExist(wall1)).equal(true);

        map.add(bot1, posA);
        map.remove(bullet1);

        expect(map.isExist(bot1)).equal(true);
        expect(map.isExist(bullet1)).equal(false);
        expect(map.isExist(wall1)).equal(true);

        map.add(bullet1, posA);
        map.remove(wall1);

        expect(map.isExist(bot1)).equal(true);
        expect(map.isExist(bullet1)).equal(true);
        expect(map.isExist(wall1)).equal(false);
      });
    });
  });

  describe('Map.getField', function() {
    it('should ret correct field for current map state', function() {
      var wall1 = new Wall();
      var field;

      map.add(wall1, posA);

      field = map.getField();

      expect(field[posA.y][posA.x]).equal(wall1);
      expect(field[posB.y][posB.x]).equal(undefined);
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