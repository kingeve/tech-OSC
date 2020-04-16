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
var dgram = require('dgram');
//load osc library
var osc = require('osc-min');

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
var udpServer = dgram.createSocket('udp4', function(msg, rinfo) {

  var oscMessage;
  try {
    oscMessage = osc.fromBuffer(msg);//get the OSC messages
    console.log(oscMessage);
  } catch(err) {
    return console.log('Could not decode OSC message');
  }
  //in case of a wrong address
  if(oscMessage.address != '/socketio') {
    return console.log('Invalid OSC address');
  }
  //prepare to send this received messages to another
  remoteOscIp = rinfo.address;

  //assign the value
  io.emit('osc', {
    x: parseInt(oscMessage.args[0].value) || 0,//|| 0 --> if there is no message, then send 0
    y: parseInt(oscMessage.args[1].value) || 0
  });

});
//SEND OSC messages
io.on('connection', function(socket) {
  socket.on('browser', function(data) {
    if(! remoteOscIp) {//in order to validate remoreOscIp, meaning if remoteOscIp is not there
      return;//this results undefined, which is different from false
    }
    var oscMsg = osc.toBuffer({
      oscType: 'message',
      address: '/socketio',
      args:[{ 
        type: 'integer',
        value: parseInt(data.x) || 0
      },
      {
        type: 'integer',
        value: parseInt(data.y) || 0
      }]
    });
    //socket.send(msg[, offset, length][, port][, address][, callback])
    udpServer.send(oscMsg, 0, oscMsg.length, 57120, remoteOscIp);
    console.log('Sent OSC message to %s:57120', remoteOscIp);// in the class I made it into 9998 which was wrong of course. it has to be 57120

  });

});

server.listen(8000);
console.log('Starting HTTP server on TCP port 8000');
udpServer.bind(9998);
console.log('Starting UDP server on UDP port 9998');
