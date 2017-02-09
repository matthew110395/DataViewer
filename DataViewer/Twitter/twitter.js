
var mysql = require("mysql");
var eclairjs = require("eclairjs");
var SQLContext = require('eclairjs/client/lib/sql/SQLContext');

var spark = new eclairjs();
var sc = new spark.SparkContext("local[*]", "Naieve Bayes");

var sqlContext = new SQLContext(sc);
var rdd = sc.textFile('mlData1.csv');


var con = mysql.createConnection({
    host: "matthew95.co.uk",
    user: "root",
    password: "matt110395",
    database: "tweets",
    charset: "utf8mb4_unicode_ci"
});
//var TwitterStream = require('twitter-stream-api'),
//    fs = require('fs');

//var keys = {
//    consumer_key: "vZjeejCKE656i8Tf5BFhHqZ3f",
//    consumer_secret: "0sIcjwPkbsNDFlO148aVTvf9oTfKGYKk14dGilNxDMaNxABYJC",
//    token: "1015860535-pZmtAxWyBZJSYwXwat6StooPRtiIxOnUP8oVDI7",
//    token_secret: "4fwNyRaqtbzTGCWq6ZqlifJONftz11IZdulgvipXIDOiy"
//};
//var Output = Writable({ objectMode: true });
//Output._write = function (obj, enc, next) {
//    console.log(obj.id, obj.text);
//    next();
//};
//var Twitter = new TwitterStream(keys, false);
//Twitter.stream('statuses/filter', {
//    track: 'whisky'
//});
//Twitter.on('data', function (obj) {
//    console.log('data', obj);
//    console.log(obj && obj.text);

//});
//Twitter.on('data keep-alive', function () {
//    console.log('data keep-alive');
//});
//Twitter.pipe(Output);

////Twitter.pipe(fs.createWriteStream('tweets.json'));

/* jshint node: true, strict: true */

"use strict";

var Writable = require('stream').Writable,
 TwitterStream = require('twitter-stream-api'),

    fs = require('fs');


    var keys = {
    consumer_key: "vZjeejCKE656i8Tf5BFhHqZ3f",
    consumer_secret: "0sIcjwPkbsNDFlO148aVTvf9oTfKGYKk14dGilNxDMaNxABYJC",
    token: "1015860535-pZmtAxWyBZJSYwXwat6StooPRtiIxOnUP8oVDI7",
    token_secret: "4fwNyRaqtbzTGCWq6ZqlifJONftz11IZdulgvipXIDOiy"
};




// Helper for outputting stream to console

var Output = Writable({ objectMode: true });
Output._write = function (obj, enc, next) {
    console.log(obj.lang,obj.id, obj.text);
    //var dat = [obj.id_str, obj.text];
    var dat = { tid: obj.id, created: obj.created_at, time_zone: obj.user.time_zone, tweet: obj.text, user: obj.user.name };
    
        con.query('INSERT INTO tweets SET ?', dat, function (err, res) {
            if (err) throw err;
            next();
        });
    
};




var Twitter = new TwitterStream(keys);

//Twitter.debug(function (reqObj) {
//    require('request-debug')(reqObj, function (type, data, req) {
//        console.log('type', type);
//    });
//});

Twitter.stream('statuses/filter', {
    track: ['whisky']
});

Twitter.on('connection success', function (uri) {
    console.log('connection success', uri);
});

Twitter.on('connection aborted', function () {
    console.log('connection aborted');
});

Twitter.on('connection error network', function () {
    console.log('connection error network');
});

Twitter.on('connection error stall', function () {
    console.log('connection error stall');
});

Twitter.on('connection error http', function () {
    console.log('connection error http');
});

Twitter.on('connection rate limit', function () {
    console.log('connection rate limit');
});

Twitter.on('connection error unknown', function () {
    console.log('connection error unknown');
});

Twitter.on('data keep-alive', function () {
    console.log('data keep-alive');
});

Twitter.on('data error', function () {
    console.log('data error');
});

Twitter.pipe(Output);
