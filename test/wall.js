'use strict';

var expect = require('chai').expect;
var Wall = require('../server/wall');

describe('Wall', function() {
  it('should create a wall', function() {
    var wall = new Wall();

    expect(wall.type).equal('wall');
  });
});