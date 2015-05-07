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
  var player1;
  var player2;
  var map;
  var combat;

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


    combat = new Combat({ tick: 200 }, combatOptions);
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

  describe('game management', function() {
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
      expect(player1.autobot.direction).equal('right');

      expect(player2.autobot).instanceOf(Autobot);
      expect(player2.autobot.position.x).equal(2);
      expect(player2.autobot.position.y).equal(4);
      expect(player2.autobot.direction).equal('right');
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
    });

    afterEach(function() {
      combat.stop();
    });

    describe('Autobot move', function() {
      it('should rotate bot', function() {
        combat.addAction(player1, { rotate: 'left' });

        helper.timer.nextTurn();
        helper.timer.nextTurn();

        expect(player1.autobot.position.x).equal(2);
        expect(player1.autobot.position.y).equal(0);
        expect(player1.autobot.direction).equal('left');
      });

      it('should move bot to empty cell', function() {
        combat.addAction(player1, { move: 'left' });

        helper.timer.nextTurn();
        helper.timer.nextTurn();
        helper.timer.nextTurn();

        expect(player1.autobot.position.x).equal(1);
        expect(player1.autobot.position.y).equal(0);
      });

      it('should move at the configured moment', function() {
        combat.addAction(player1, { move: 'up'});
        combat.addAction(player1, { move: 'right'});

        helper.timer.nextTurn();

        expect(player1.autobot.position.y).equal(0);

        helper.timer.nextTurn();

        expect(player1.autobot.position.y).equal(0);

        helper.timer.nextTurn();

        expect(player1.autobot.position.y).equal(1);
        expect(player1.autobot.position.x).equal(2);

        helper.timer.nextTurn();

        expect(player1.autobot.position.x).equal(2);

        helper.timer.nextTurn();

        expect(player1.autobot.position.x).equal(3);
      });

      it('should not move player to an obstacle', function() {
        combat.addAction(player1, { move: 'down' });
        combat.addAction(player1, { move: 'right' });
        combat.addAction(player1, { move: 'up' });

        helper.timer.nextTurn();

        expect(player1.autobot.position.x).equal(2);
        expect(player1.autobot.position.y).equal(0);

        helper.timer.nextTurn();

        expect(player1.autobot.position.x).equal(2);
        expect(player1.autobot.position.y).equal(0);

        map.move(player2.autobot, new Position(2, 1));

        helper.timer.nextTurn();

        expect(player1.autobot.position.x).equal(2);
        expect(player1.autobot.position.y).equal(0);
      });

      it('should move and rotate', function() {
        combat.addAction(player1, { move: 'left', rotate: 'left' });

        helper.timer.nextTurn();

        expect(player1.autobot.position.x).equal(2);
        expect(player1.autobot.position.y).equal(0);
        expect(player1.autobot.direction).equal('right');

        helper.timer.nextTurn();

        expect(player1.autobot.position.x).equal(2);
        expect(player1.autobot.position.y).equal(0);
        expect(player1.autobot.direction).equal('left');

        helper.timer.nextTurn();

        expect(player1.autobot.position.x).equal(1);
        expect(player1.autobot.position.y).equal(0);
        expect(player1.autobot.direction).equal('left');
      });
    });
    
    describe('Autobot fire', function() {
      var bullets;

      it('should fire in current direction', function() {
        combat.addAction(player1, { rotate: 'up' });
        combat.addAction(player2, { rotate: 'down' });

        helper.timer.nextTurn();
        helper.timer.nextTurn();

        expect(player1.autobot.direction).equal('up');
        combat.addAction(player1, { fire: true });

        helper.timer.nextTurn();

        bullets = map.getBullets();

        expect(bullets).length(1);
        expect(bullets[0].position.x).equal(2);
        expect(bullets[0].position.y).equal(0);
        expect(bullets[0].direction).equal('up');

        combat.addAction(player2, { fire: true });

        helper.timer.nextTurn();

        bullets = map.getBullets();

        expect(bullets).length(2);
        expect(bullets[0].position.x).equal(2);
        expect(bullets[0].position.y).equal(1);

        expect(bullets[1].position.x).equal(2);
        expect(bullets[1].position.y).equal(4);
        expect(bullets[1].direction).equal('down');
      });
      
      it('should fire only when ready', function() {
        combat.addAction(player1, { rotate: 'up' });

        helper.timer.nextTurn();
        helper.timer.nextTurn();

        combat.addAction(player1, { fire: true });
        combat.addAction(player1, { fire: true });

        helper.timer.nextTurn();

        expect(map.getBullets()).length(1);

        helper.timer.nextTurn();

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