'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var helper = require('./helper');

var Combat = require('../server/combat');
var Player = require('../server/player');
var Autobot = require('../server/autobot');
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

      expect(player2.autobot).instanceOf(Autobot);
      expect(player2.autobot.position.x).equal(2);
      expect(player2.autobot.position.y).equal(4);
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
});