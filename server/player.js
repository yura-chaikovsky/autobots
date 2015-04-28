var counter = 0;

function Player(token) {
  this.id = 'player#' + counter;

  ++counter;

  this.name = token;
  this.autobot = null;
}

module.exports = Player;