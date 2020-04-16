//First create an express server

var express = require('express');
var app = express();
var http = require('http');//allows Node.js to transfer data over the Hyper Text Transfer Protocol (HTTP).
var fs = require('fs');//file system library, which allows Node.js to access to the file system

//Now we are using express server for http
var server = http.Server(app);



//// Loading the index file . html displayed to the client
app.get('/', function(req,res){
    //fs.readFile: https://nodejs.org/docs/latest-v13.x/api/fs.html#fs_fs_readfile_path_options_callback
    fs.readFile('./index2.html', 'utf-8', function(error, content) {
      //In case of an error, it creates a html file with the error content.
      if(error) {
        res.writeHead(500);//(status code 200)
        return res.end('Error loading index.html');
      }
      //loading index.html file
        res.writeHead(200, {"Content-Type": "text/html"}); //writes the HTTP header (status code 200)
        res.end(content);//writes the body and closes the response
    });
  });

// Loading socket.io
var io = require('socket.io').listen(server);

//When a client connects, we note it in the console


//Server side message when connected
io.sockets.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });//emit an event to the 'news' socket
    socket.on('my other event', function (data) {//listen to the 'my other event' socket
      console.log(data);
    });
  });
server.listen(8080);
