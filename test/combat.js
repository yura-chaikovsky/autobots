'use strict';

var config = require('../server/config.json');

var expect = require('chai').expect;
var sinon = require('sinon');
var helper = require('./helper');

var Combat = require('../server/combat');
var Player = require('../server/player');
var Autobot = require('../server/autobot');
var Position = require('../server/position');
var Wall = require('../server/wall');

describe('Combat', function() {
  var clock;
  var game;
  var player1;
  var player2;
  var map;
  var combat;

  beforeEach(function() {
    var combatOptions = {};

    clock = sinon.useFakeTimers();

    game = helper.createGameStub();
    map = helper.createMap();
    player1 = new Player('ironhide');
    player2 = new Player('optimus-prime');

    combatOptions.map = map;
    combatOptions.players = [player1, player2];
    combatOptions.config = {
      tick: 200
    };

    combat = new Combat(game, combatOptions);
  });

  afterEach(function() {
    clock.restore();
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

    it('should start the game', function() {
      combat.start();

      clock.tick(50);

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
      combat.start();

      clock.tick(450);
      state = combat.getState();

      expect(game.broadcastCombatState.callCount).equal(3);
      expect(state.turn).equal(2);

      clock.tick(600);
      state = combat.getState();

      expect(game.broadcastCombatState.callCount).equal(6);
      expect(state.turn).equal(5);
    });

    it('should stop the game', function() {
      combat.start();

      clock.tick(450);
      combat.stop();

      clock.tick(600);
      state = combat.getState();

      expect(game.broadcastCombatState.callCount).equal(3);
      expect(state.turn).equal(2);
      expect(player1.autobot).equal(null);
      expect(player2.autobot).equal(null);
    });
  });

  describe('Actions', function() {
    beforeEach(function() {
      combat.start();
    });

    afterEach(function() {
      combat.stop();
    });
    
    it('should apply action at once', function() {
      combat.addAction(player1, 'move', { direction: 'up' });

      clock.tick(250);
      
      expect(player1.autobot.position.y).equal(1);
    });

    describe('Autobot move', function() {
      it('should rotate bot', function() {
        combat.addAction(player1, 'move', { rotation: 'left' });

        clock.tick(250);

        expect(player1.autobot.position.x).equal(2);
        expect(player1.autobot.position.y).equal(0);
        expect(player1.autobot.direction).equal('left');
      });

      it('should move bot to empty cell', function() {
        combat.addAction(player1, 'move', { direction: 'left' });

        clock.tick(250);

        expect(player1.autobot.position.x).equal(1);
        expect(player1.autobot.position.y).equal(0);
        expect(player1.autobot.direction).equal('left');
      });

      it('should continue act only after cooldown', function() {
        combat.addAction(player1, 'move', { rotation: 'up' });
        combat.addAction(player1, 'move', { rotation: 'right' });
        combat.addAction(player1, 'move', { direction: 'left' });

        clock.tick(250);

        expect(player1.autobot.direction).equal('up');

        clock.tick(200);

        expect(player1.autobot.direction).equal('up');

        clock.tick(200);

        expect(player1.autobot.direction).equal('right');

        clock.tick(200);

        expect(player1.autobot.direction).equal('right');

        clock.tick(200);

        expect(player1.autobot.direction).equal('left');
      });

      it('should move bot with custom rotation', function() {
        combat.addAction(player1, 'move', { direction: 'left', rotation: 'right' });
        combat.addAction(player1, 'move', { direction: 'up', rotation: 'left' });
        combat.addAction(player1, 'move', { direction: 'right', rotation: 'down' });
        combat.addAction(player1, 'move', { direction: 'down', rotation: 'up' });

        clock.tick(250);

        expect(player1.autobot.position.x).equal(1);
        expect(player1.autobot.position.y).equal(0);
        expect(player1.autobot.direction).equal('right');

        clock.tick(400);

        expect(player1.autobot.position.x).equal(1);
        expect(player1.autobot.position.y).equal(1);
        expect(player1.autobot.direction).equal('left');

        clock.tick(400);

        expect(player1.autobot.position.x).equal(2);
        expect(player1.autobot.position.y).equal(1);
        expect(player1.autobot.direction).equal('down');

        clock.tick(400);

        expect(player1.autobot.position.x).equal(2);
        expect(player1.autobot.position.y).equal(0);
        expect(player1.autobot.direction).equal('up');
      });

      it('should not move player to an obstacle', function() {
        combat.addAction(player1, 'move', { direction: 'down' });
        combat.addAction(player1, 'move', { direction: 'right' });
        combat.addAction(player1, 'move', { direction: 'up' });

        clock.tick(250);

        expect(player1.autobot.position.x).equal(2);
        expect(player1.autobot.position.y).equal(0);
        expect(player1.autobot.direction).equal('down');

        clock.tick(400);

        expect(player1.autobot.position.x).equal(2);
        expect(player1.autobot.position.y).equal(0);
        expect(player1.autobot.direction).equal('right');

        map.move(player2.autobot, new Position(2, 1));

        clock.tick(400);

        expect(player1.autobot.position.x).equal(2);
        expect(player1.autobot.position.y).equal(0);
        expect(player1.autobot.direction).equal('up');
      });
    });
    
    describe('Autobot fire', function() {
      it('should ', function() {
        
        
      });
    });
  });
  
});