

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var tweets = require('./Data/test.json');

console.log(tweets);
//$.getJSON("./Data/smtweets.js", function (json) {
//    tweets = json
//});


app.use(express.static('public'));
app.use('/js', express.static(__dirname + 'public / js'));
app.use('/css', express.static(__dirname + 'public / css'));

http.listen(8000, function () {
    console.log('listening on *:8000');
    io.on('connection', function (socket) {
    });

});

//var http = require('http');
//var port = process.env.port || 8000;
//http.createServer(function (req, res) {
//    res.writeHead(200, { 'Content-Type': 'text/plain' });
//    res.end('Hello World\n');
//}).listen(port); 