'use strict';

var mapGenerator = require('./map-generator');
var Combat = require('./combat');
var Player = require('./player');

function Game(io, config) {
  var _this = this;
  var players = {};
  var combats = [];
  var currentCombat = null;

  io.on('connection', function(client) {
    var id = Date.now();
    var player;

    console.log('A user connected ' + id);

    client.on('join-game', function(data) {
      player = players[data.token] || new Player(data.token);

      console.log(player.name + ' entered the game');

      if (players[data.token]) {
        return;
      }

      players[data.token] = player;

      client.emit('registration', {
        playerId: player.id
      });

      _this.broadcastPlayersUpdate();
    });

    client.on('get-players', function() {
      _this.broadcastPlayersUpdate();
    });

    client.on('start-combat', function(data) {
      var combatOptions = {};

      if (currentCombat) {
        return;
      }

      combatOptions.game = _this;
      combatOptions.globalConfig = config;
      combatOptions.map = mapGenerator.generate(config);

      combatOptions.players = _this.getPlayers().filter(function(player) {
        return -1 !== data.playerIds.indexOf(player.id);
      });

      if (combatOptions.players.length < 2) {
        return console.log('There should be at least 2 players!');
      }

      currentCombat = new Combat(config.combat, combatOptions);

      currentCombat.start();
    });

    client.on('send-commands', function(data) {
      if (!player || !player.autobot) {
        return console.log(id + ' tried to send a command');
      }

      currentCombat.addAction(player, data);
    });

    client.on('disconnect', function() {
      console.log(id + ' disconnected');

      if (!player) {
        return;
      }

      console.log(player.name + ' left the game');

      _this.broadcastPlayersUpdate();
    });
  });

  this.getPlayers = function() {
    return Object.keys(players).map(function(token) {
      return players[token];
    });
  };

  this.finishCombat = function() {
    combats.push(currentCombat);
    currentCombat = null;
  };

  this.broadcastCombatState = function(combat) {
    io.emit('state-update', combat.getState());
    io.emit('view-update', combat.getView());
  };

  this.broadcastPlayersUpdate = function() {
    io.emit('players-update', {
      players: _this.getPlayers()
    });
  };
}

module.exports = Game;
