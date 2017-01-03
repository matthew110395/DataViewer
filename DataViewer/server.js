

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql = require("mysql");


var con = mysql.createConnection({
    host: "matthew95.co.uk",
    user: "root",
    password: "matt110395",
    database: "tweets",
    charset: "utf8mb4_unicode_ci"
});
var noTweets = 0;
function refNoTweets() {
    con.query("SELECT Count(tid) AS 'noTw' FROM tweets WHERE right(created,4) = DATE_FORMAT(CURDATE(),'%Y') AND left(created,10)=DATE_FORMAT(CURDATE(),'%a %b %d')", function (err, rows) {
        if (err) throw err;

        console.log('Data received from Db:\n');
        if (noTweets != rows[0].noTw) {

            noTweets = rows[0].noTw;
            io.emit('noTw', noTweets);
        }


    });

}
function tweetbyday() {
    con.query("SELECT Count(tid) AS 'noTw' FROM tweets WHERE right(created,4)  DATE_FORMAT(CURDATE(),'%Y') AND left(created,10)=DATE_FORMAT(CURDATE(),'%a %b %d')", function (err, rows) {
        if (err) throw err;

        console.log('Data received from Db:\n');
        if (noTweets != rows[0].noTw) {

            noTweets = rows[0].noTw;
            io.emit('noTw', noTweets);
        }


    });

}
setInterval(refNoTweets, 5000)



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