//define express server
var express = require('express');
var app = express();
//create http 
var http = require('http');
var fs = require('fs');
//define socket io
var socketIO = require('socket.io');
var server = http.Server(app);
var io = socketIO(server);
//load dgram
var dgram ;
//load osc library
var osc ;

var remoteOscIp;

app.get('/', function(req,res){
  fs.readFile(__dirname + '/index.html', function(error, content) {
    if(error) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    res.writeHead(200);
    res.end(content);

  });
});


//RECEIVE the OSC messages
//open udpServer
var udpServer;
//SEND OSC messages
io.on('connection', function(socket) {
  socket.on('browser', function(data) {
    if(! remoteOscIp) {
      return;
    }
    var oscMsg ;

  });

});

server.listen(8000);
console.log('Starting HTTP server on TCP port 8000');

