var EventEmitter = require('events').EventEmitter;

var Game = function(players) {
  this._players = players || [Game.EMPTY_PLAYER, Game.EMPTY_PLAYER];

  this._isFinished = false;

  this._events = new EventEmitter();
};

Game.prototype.on = function(name, handler) {
  this._events.on(name, handler);
};

Game.prototype.getPlayers = function() {
  return this._players;
};

Game.prototype.setPlayer = function(player, index) {
  if (this._players[index] !== Game.EMPTY_PLAYER && this._players[index] !== Game.UNKNOWN_PLAYER) {
    return;
  }

  this._players[index] = player;
};

Game.prototype.hasPlayers = function() {
  return this._players[0] !== Game.EMPTY_PLAYER && this._players[1] !== Game.EMPTY_PLAYER;
};

Game.prototype.isComplete = function() {
  return this._isFinished || !this.hasPlayers();
};

Game.prototype.toJSON = function() {
  return [this._players[0], this._players[1]];
};

Game.prototype.getWinner = function() {
  return this._winner || Game.UNKNOWN_PLAYER;
};

Game.prototype.getLoser = function() {
  return this._loser || Game.UNKNOWN_PLAYER;
};

Game.prototype.end = function(winner) {
  if (this._players.indexOf(winner) === -1) {
    throw "Unknown player for this game";
  }

  this._winner = winner;
  this._loser = this._players[0] === winner ? this._players[1] : this._players[0];
  this._isFinished = true;

  this._events.emit('complete');
};

Game.UNKNOWN_PLAYER = 'unknown';
Game.EMPTY_PLAYER = 'empty';

module.exports = Game;