/*Autobots Tournament*/

var Net = require('./net');

/*Everyday I'm Shuffling*/
function shuffle(array) {
  if (array.length < 2) {
    return array;
  }

  var res = [],
    copy = ([]).concat(array);

  while(copy.length !== 0) {
    res = res.concat(copy.splice(Math.floor(Math.random() * copy.length), 1));
  }

  return res;
}


var Tournament = function(players) {
  this._players = shuffle(players);

  this._net = new Net(this._players);
};

Tournament.prototype.getNextGame = function() {
  return this._net.getNextGame();
};

Tournament.prototype.results = function() {
  return this._net.getResults();
};

Tournament.prototype.toJSON = function() {
  return this._net.toJSON();
};

module.exports = Tournament;

//console.log(JSON.stringify((new Tournament(['Bumblebee', 'Ironhide', 'Prowl', 'Jazz', 'Wheeljack'])).toJSON()));