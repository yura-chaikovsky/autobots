var fs = require('fs');
var server = require('http').Server(handler);
var io = require('socket.io')(server);
var path = require('path');

var app = new require('../prototypes/server/app.js');
var config = require('../prototypes/server/config.json');


var PORT = 8000;

app.initialize(io, config);

console.log('listening on *:' + PORT);
server.listen(PORT);

function handler(request, response) {
   console.log('request starting...');

  	var filePath = '.' + request.url;
  	if (filePath === './')
  		filePath = './index.html';

  	var extname = path.extname(filePath);
  	var contentType = 'text/html';
  	switch (extname) {
  		case '.js':
  			contentType = 'text/javascript';
  			break;
  		case '.css':
  			contentType = 'text/css';
  			break;

  		case '.jpg':
  			contentType = 'image/jpeg';
  			break;

  		case '.png':
  			contentType = 'image/png';
  			break;
  	}

  	path.exists(filePath, function(exists) {

  		if (exists) {
  			fs.readFile(filePath, function(error, content) {
  				if (error) {
  					response.writeHead(500);
  					response.end();
  				}
  				else {
  					response.writeHead(200, { 'Content-Type': contentType });
  					response.end(content, 'utf-8');
  				}
  			});
  		}
  		else {
  			response.writeHead(404);
  			response.end();
  		}
  	});
}
