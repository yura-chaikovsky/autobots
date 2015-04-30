'use strict';

var expect = require('chai').expect;
var helper = require('./helper');

var Combat = require('../server/combat');
var Player = require('../server/player');
var Autobot = require('../server/autobot');

describe('Combat', function() {
  var game = helper.createGameStub();
  var player1;
  var player2;
  var map;
  var combat;

  beforeEach(function() {
    map = helper.createMap();
    player1 = new Player('ironhide');
    player2 = new Player('optimus-prime');
    combat = new Combat(game, {
      map: map,
      players: [player1, player2]
    });
  });

  it('should create a combat', function() {
    expect(map.getBots()).length(2);
    expect(player1.autobot).instanceOf(Autobot);
    expect(player2.autobot).instanceOf(Autobot);
  });
});