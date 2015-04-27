var assert = require('chai').assert;
var Wall = require('../server/wall');

describe('Wall', function() {
  it('should create a wall', function() {
    var wall = new Wall();

    assert.equal('wall', wall.type);
  });
});