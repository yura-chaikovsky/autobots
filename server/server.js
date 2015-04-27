var fs = require('fs');
var server = require('http').Server(handler);
var io = require('socket.io')(server);
var path = require('path');

var app = require('./app.js');
var config = require('./config.json');


var PORT = 8000;

app.initialize(io, config);

console.log('listening on *:' + PORT);
server.listen(PORT);

var CONTENT_TYPES = {
  js: 'text/javascript',
  css: 'text/css',
  jpg: 'image/jpeg',
  png: 'image/png'
};

function handler(request, response) {
  var relativePath = request.url.slice(1) || 'index.html';
  var filePath = './view-client/' + relativePath;
  var extension = path.extname(filePath).slice(1);
  var contentType = CONTENT_TYPES[extension] || 'text/html';

  fs.exists(filePath, function(exists) {
    if (!exists) {
      response.writeHead(404);
      response.end();

      return;
    }

    fs.readFile(filePath, function(error, content) {
      if (error) {
        response.writeHead(500);
        response.end();

        return;
      }

      response.writeHead(200, { 'Content-Type': contentType });
      response.end(content, 'utf-8');
    });
  });
}
