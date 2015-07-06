'use strict';

var ActionHandler = require('./action-handler');
var Autobot = require('./autobot');

function Combat(config, options) {
  var _this = this;

  var map = options.map;
  var actionHandler = new ActionHandler({
    map: map,
    globalConfig: options.globalConfig
  });

  var players = options.players;
  var currentTurn = 0;
  var timer;


  // manage the game

  this.start = function() {
    // add autobot to each player
    players.forEach(function(player) {
      player.autobot = new Autobot(options.globalConfig.autobot, {
        playerId: player.id,
        name: player.name,
        direction: 'right'
      });

      map.add(player.autobot, map.getStartPosition());
    });

    options.game.broadcastCombatState(_this);

    // run game loop
    timer = setInterval(function() {
      if (map.getBots().length < 2) {
        _this.stop();
      }

      console.log('Current turn: ' + currentTurn);

      playTact();

      options.game.broadcastCombatState(_this);

      ++currentTurn;
    }, config.tick);
  };

  this.stop = function() {
    // stop game loop
    clearInterval(timer);

    // remove autobot from each player
    players.forEach(function(player) {
      player.autobot = null;
    });

    // notify the game that combat is finished
    options.game.finishCombat(this);
  };

  this.addAction = function(player, actionData) {
    var commands = {};

    Object.keys(actionData).forEach(function(type) {
      var command = actionHandler.getAction(player.autobot, type, actionData[type]);

      if (command) {
        commands[type] = command;
      }
    }, this);

    player.autobot.addAction(commands);
  };

  this.getState = function() {
    return {
      turn: currentTurn,
      autobots: map.getBots().map(getItemState),
      bullets: map.getBullets().map(getItemState),
      walls: map.getWalls().map(getItemState)
    };

    function getItemState(item) {
      return item.getState();
    }
  };

  this.getView = function() {
    var state = this.getState();

    state.map = map.getField();

    return state;
  };


  // helpers

  function playTact() {
    map.getBots().forEach(function(bot) {
      bot.act();
    });

    // bullets are moved after bots
    map.getBullets().forEach(function(bullet) {
      bullet.act();
    });
  }
}

module.exports = Combat;