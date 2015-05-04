var Game = require('./game');

/*Возвращает целое число от логарифма по основании 2*/
function getIntLog2(n) {
  return Math.ceil(Math.log(n) / Math.log(2));
}

/*Быстрое возведение в степень двойки*/
function pow2(n) {
  return 1 << n;
}

var Net = function(players) {
  var left,
    i,
    j,
    indexesEven,
    indexesOdd,
    indexes,
    last,
    length,
    preLast,
    k;

  if (!players || players.length === 1) {
    throw new Error("Players length should be more than 2");
  }

  this.net = new Array(getIntLog2(players.length) - 1);
  this.finals = [new Game([Game.UNKNOWN_PLAYER, Game.UNKNOWN_PLAYER]),
    new Game([Game.UNKNOWN_PLAYER, Game.UNKNOWN_PLAYER])];

  if (players.length === 2) {
    this.finals = [new Game(), new Game(players[0], players[1])];

    return;
  }

  if (players.length === 3) {
    this.finals = [new Game([Game.UNKNOWN_PLAYER, Game.EMPTY_PLAYER]),
      new Game([players[0], Game.UNKNOWN_PLAYER])];

    this.net[0] = [new Game(), new Game([players[1], players[2]])];

    return;
  }

  for (i = 0; i < this.net.length; ++i) {
    this.net[i] = new Array(pow2(i + 1));

    for (j = 0; j < this.net[i].length; ++j) {
      this.net[i][j] = new Game();
    }
  }

  left = players.length - pow2(this.net.length);
  last = this.net[this.net.length - 1];

  /*Если крайний уровень будет забит полностью*/
  if (left === 0) {
    this.net.forEach(function(net) {
      net.forEach(function(game) {
        game.setPlayer(Game.UNKNOWN_PLAYER, 0)
        game.setPlayer(Game.UNKNOWN_PLAYER, 1)
      });
    });

    last.forEach(function(game, i) {
      game.setPlayer(players[i * 2], 0);
      game.setPlayer(players[i * 2 + 1], 1);
    });

    this._initGames();

    return;
  }

  /*Хочу почситать индексы заранее, они нужны для того,
    чтобы, если не хватает игроков - расставить их красиво*/
  indexesEven = [];
  indexesOdd = [];
  
  length = last.length / 2;

  for (i = 0; i < length / 2; ++i) {
    indexesEven.push(2 * i, length + i * 2);
    indexesOdd.push(2 * i + 1, length + i * 2 + 1);
  }

  indexes = indexesEven.concat(indexesOdd);

  for (i = 0; i < left; ++i) {
    last[indexes[i]].setPlayer(players[i * 2], 0);
    last[indexes[i]].setPlayer(players[i * 2 + 1], 1);
  }

  preLast = this.net[this.net.length - 2];
  j = left * 2;

  for (i = 0; i < preLast.length; ++i) {
    for (k = 0; k < 2; ++k) {
      if (last[i * 2 + k].hasPlayers()) {
        preLast[i].setPlayer(Game.UNKNOWN_PLAYER, k);

        continue;
      }

      preLast[i].setPlayer(players[j++], k);
    }
  }

  for (i = 0; i < this.net.length - 2; ++i) {
    this.net[i].forEach(function(game) {
      game.setPlayer(Game.UNKNOWN_PLAYER, 0);
      game.setPlayer(Game.UNKNOWN_PLAYER, 1);
    });
  }

  this._initGames();
};

Net.prototype._initGames = function() {
  this.net.forEach(function(net, i) {
    net.forEach(function(game, j) {
      game.on('complete', this._next.bind(this, game, i, j));
    }.bind(this));
  }.bind(this));
};

Net.prototype._next = function(game, i, j) {
  if (i === 0) {
    this.finals[0].setPlayer(game.getLoser(), j % 2);
    this.finals[1].setPlayer(game.getWinner(), j % 2);

    return;
  }

  this.net[i - 1][Math.floor(j / 2)].setPlayer(game.getWinner(), j % 2);
};

Net.prototype.toJSON = function() {
  var games = ([this.finals]).concat(this.net).map(function(lvl) {
    return lvl.map(function(game) {
      return game.toJSON();
    });
  });

  return {
    net: games,
    results: this.getResults()
  };
};

Net.prototype.getResults = function() {
  var res = [Game.UNKNOWN_PLAYER, Game.UNKNOWN_PLAYER, Game.UNKNOWN_PLAYER];

  if (!this.finals[0].isComplete()) {
    return res;
  }

  res[0] = this.finals[0].getWinner();

  if (!this.finals[1].isComplete()) {
    return res;
  }

  res[1] = this.finals[1].getLoser();
  res[2] = this.finals[1].getWinner();

  return res;
}

Net.prototype.getNextGame = function() {
  var i,
    j,
    matches = ([this.finals]).concat(this.net).reverse();

  for (i = 0; i < matches.length; ++i) {
    for (j = 0; j < matches[i].length; ++j) {
      if (!matches[i][j].isComplete()) {
        return matches[i][j];
      }
    }
  }

  throw "Tournament is ended";
};

module.exports = Net;