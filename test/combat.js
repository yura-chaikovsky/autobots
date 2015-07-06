'use strict';

var config = require('./data/config');

var expect = require('chai').expect;
var helper = require('./helper');

var Combat = require('../server/combat');
var Player = require('../server/player');
var Autobot = require('../server/autobot');
var Position = require('../server/position');
var Wall = require('../server/wall');

describe('Combat', function() {
  var game;
  var combat;
  var map;
  var player1;
  var player2;
  var bot1;
  var bot2;

  beforeEach(function() {
    var combatOptions = {};

    helper.timer.initialize();

    game = helper.createGameStub();
    map = helper.createMap();

    player1 = new Player('ironhide');
    player2 = new Player('optimus-prime');

    combatOptions.map = map;
    combatOptions.players = [player1, player2];
    combatOptions.globalConfig = config;
    combatOptions.game = game;

    combat = new Combat(config.combat, combatOptions);
  });

  afterEach(function() {
    helper.timer.reset();
  });

  it('should create a combat', function() {
    var stateData = combat.getState();
    var viewData = combat.getView();

    expect(stateData.turn).equal(0);
    expect(stateData.autobots).length(0);
    expect(stateData.bullets).length(0);
    expect(stateData.walls).length(3);

    expect(viewData.map).length(5);
    expect(viewData.map[0]).length(5);
  });

  describe('combat management', function() {
    var state;
    
    beforeEach(function() {
      combat.start();
      helper.timer.start();
    });

    it('should start the game', function() {
      state = combat.getState();

      expect(game.broadcastCombatState.calledOnce).equal(true);

      expect(player1.autobot).instanceOf(Autobot);
      expect(player1.autobot.position.x).equal(2);
      expect(player1.autobot.position.y).equal(0);

      expect(player2.autobot).instanceOf(Autobot);
      expect(player2.autobot.position.x).equal(2);
      expect(player2.autobot.position.y).equal(4);
    });

    it('should send state each tick', function() {
      helper.timer.tick(2);

      expect(game.broadcastCombatState.callCount).equal(3);
      expect(combat.getState().turn).equal(2);

      helper.timer.tick(3);

      expect(game.broadcastCombatState.callCount).equal(6);
      expect(combat.getState().turn).equal(5);
    });

    it('should stop the game', function() {

      helper.timer.tick(2);
      combat.stop();

      helper.timer.tick(3);

      expect(game.broadcastCombatState.callCount).equal(3);
      expect(combat.getState().turn).equal(2);
      expect(player1.autobot).equal(null);
      expect(player2.autobot).equal(null);
    });
  });

  describe('Actions', function() {
    beforeEach(function() {
      combat.start();
      helper.timer.start();

      bot1 = player1.autobot;
      bot2 = player2.autobot;
    });

    afterEach(function() {
      combat.stop();
    });

    describe('Autobot rotate', function() {
      it('should rotate bot at configured moment', function() {
        combat.addAction(player1, { rotate: 'left' });

        helper.timer.nextTurn();

        expect(bot1.direction).not.equal('left');

        helper.timer.waitForResult('rotate');

        expect(bot1.direction).equal('left');
      });
    });

    describe('Autobot move', function() {
      it('should move bot to empty cell at configured moment', function() {
        expect(map.isEmpty(new Position(1, 0))).equal(true, 'Initial map has changed at (1, 0)');

        combat.addAction(player1, { move: 'left' });

        helper.timer.nextTurn();

        expect(bot1.position.x).equal(2, 'Bot was moved before it was expected');

        helper.timer.waitForResult('move');

        expect(bot1.position.x).equal(1, 'Bot was not moved as expected');
      });

      it('should not move bot outside', function() {
        combat.addAction(player1, { move: 'down' });

        helper.timer.nextTurn();
        helper.timer.waitForResult('move');

        expect(bot1.position.y).equal(0);
      });

      it('should not move bot towards a wall', function() {
        expect(map.getItem(new Position(3, 0))).instanceOf(Wall, 'Initial map has changed at (3, 0)');

        combat.addAction(player1, { move: 'right' });

        helper.timer.nextTurn();
        helper.timer.waitForResult('move');

        expect(bot1.position.x).equal(2);
      });

      it('should not move bot towards another bot', function() {
        map.move(bot2, new Position(2, 1));

        combat.addAction(player1, { move: 'up' });

        helper.timer.nextTurn();
        helper.timer.waitForResult('move');

        expect(bot1.position.y).equal(0);
      });
    });

    describe('Autobot move and rotate', function() {
      it('should rotate when moving', function() {
        combat.addAction(player1, { move: 'left', rotate: 'up' });

        helper.timer.nextTurn();

        helper.timer.waitForResult('rotate');

        expect(bot1.direction).equal('up');
      });

      it('should move when rotating', function() {
        combat.addAction(player1, { move: 'left', rotate: 'up' });

        helper.timer.nextTurn();

        helper.timer.waitForResult('move');

        expect(bot1.position.x).equal(1);
      });
    });
    
    describe('Autobot fire', function() {
      var bullets;

      it('should create bullet at configured moment', function() {
        expect(map.getBullets()).length(0, 'Unexpected bullets are on the field');

        combat.addAction(player1, { fire: true });

        helper.timer.nextTurn();
        helper.timer.waitForResult('fire');

        expect(map.getBullets()).length(1);
      });

      it('should fire in current direction', function() {
        combat.addAction(player1, { rotate: 'up' });

        helper.timer.nextTurn();
        helper.timer.waitForResult('rotate');

        combat.addAction(player1, { fire: true });

        helper.timer.nextTurn();
        helper.timer.waitForResult('fire');

        bullets = map.getBullets();

        expect(bullets).length(1);
        expect(bullets[0].position.x).equal(2);
        expect(bullets[0].position.y).equal(0);
        expect(bullets[0].direction).equal('up');
      });

      it('should move bullet each turn', function() {
        var bullet;

        combat.addAction(player1, { rotate: 'up' });

        helper.timer.nextTurn();
        helper.timer.waitForResult('rotate');

        combat.addAction(player1, { fire: true });

        helper.timer.nextTurn();
        helper.timer.waitForResult('fire');

        bullet = map.getBullets()[0];

        expect(bullet.position.y).equal(0);

        helper.timer.nextTurn();

        expect(bullet.position.y).equal(1);

        helper.timer.nextTurn();

        expect(bullet.position.y).equal(2);
      });
      
      it('should fire only when ready', function() {
        combat.addAction(player1, { rotate: 'up' });

        helper.timer.nextTurn();
        helper.timer.waitForResult('rotate');

        combat.addAction(player1, { fire: true });
        combat.addAction(player1, { fire: true });

        helper.timer.nextTurn();
        helper.timer.waitForResult('fire');

        expect(map.getBullets()).length(1);

        helper.timer.waitBeforeReady('fire');

        expect(map.getBullets()).length(1);

        helper.timer.nextTurn();

        expect(map.getBullets()).length(2);
      });
    });

    describe('Autobot mixed actions', function() {
      var bullets;

      it('should fire before move and rotate', function() {
        combat.addAction(player1, { move: 'up', rotate: 'left', fire: true });

        helper.timer.nextTurn();

        bullets = map.getBullets();

        expect(bullets[0].position.x).equal(2);
        expect(bullets[0].position.y).equal(0);
        expect(bullets[0].direction).equal('right');
      });

      it('should be able to fire at any moment of movement', function() {
        combat.addAction(player1, { move: 'up', rotate: 'left' });

        helper.timer.nextTurn();
        helper.timer.nextTurn();

        combat.addAction(player1, { fire: true });

        helper.timer.nextTurn();

        bullets = map.getBullets();

        expect(bullets[0].position.x).equal(2);
        expect(bullets[0].position.y).equal(0);
        expect(bullets[0].direction).equal('left');
      });
    });
  });
});