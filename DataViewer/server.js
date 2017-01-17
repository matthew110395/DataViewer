

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql = require("mysql");
var fs = require('fs');
var conf = require('./Public/config.json');

var Q = require('q');


var con = mysql.createConnection({
    host: "10.0.0.214",
    user: "root",
    password: "matt110395",
    database: "tweets",
    charset: "utf8mb4_unicode_ci"
});
con.connect(function (err) {
    if (err) {
        console.log('Error connecting to Db');
        return;
    }
    console.log('Connection established');
});
var noTweets = 0;

function getWordAt(str, pos) {

    // Perform type conversions.
    str = String(str);
    pos = Number(pos) >>> 0;

    // Search for the word's beginning and end.
    var left = str.slice(0, pos + 1).search(/\S+$/),
        right = str.slice(pos).search(/\s/);

    // The last word in the string is a special case.
    if (right < 0) {
        return str.slice(left);
    }

    // Return the word, using the located bounds to extract it from the string.
    return str.slice(left, right + pos);

}
function query(qer,name) {
    var deferred = Q.defer();

    con.query(qer, function (err, datar, fields) {
        if (err) {
            deferred.reject(new Error(err));
        } else {
            var obj = {
                cname:name,
                data: datar,
                names: fields
            };
            deferred.resolve(obj);
        }
    });
    return deferred.promise;
  
}

var i = 0;
setInterval(function () {
    var n = 0
    //for (var n = 0; n < conf.charts.length; n++) {
    while (n < conf.charts.length) {

        var labels = [];
        var data = [];
        var send = {};
        var sdata = [];
        tempstr = conf.charts[n].csql;
        var firstAs = tempstr.indexOf("AS");
        tempstr = tempstr.slice(firstAs + 2);
        console.log(tempstr);
        var secondAs = tempstr.indexOf("AS");
        if (secondAs >= 0) {
            secondAs = secondAs + firstAs + 2;

            var lab = getWordAt(conf.charts[n].csql, firstAs + 3);
            var dat = getWordAt(conf.charts[n].csql, secondAs + 3);
        } else {
            var lab = "";
            var dat = getWordAt(conf.charts[n].csql, firstAs + 3);
        }
        if (lab.indexOf(',') > 0) {
            lab = lab.substring(0, lab.length - 1);
        }
        if (dat.indexOf(',') > 0) {
            dat = dat.substring(0, dat.length - 1);
        }

        var promise = query(conf.charts[n].csql, conf.charts[n].name);
        promise.then(function (values) {
            //console.log(data);
            //console.log(field);

            labels = [];
            data = [];

            for (j in values.data) {
                //var obj = [];
                //for (var key in sdata[i]) {
                //    obj.push(sdata[i].
                //}

                if (values.names.length > 1) {
                    labels.push(values.data[j][values.names[0].name]);
                    data.push(values.data[j][values.names[1].name]);
                } else {
                    data.push(values.data[j][values.names[0].name]);
                }
            }
            //console.log(labels);
            console.log(data);

            send = {
                labs: labels,
                dat: data
            };


            console.log(values.cname[0], send);

            io.emit(values.cname[0], send);
        });
        
        //con.query(conf.charts[n].csql, function (err, datar, fields) {
           
        //        console.log(fields);
        //        //if (err) throw err
        //        sdata = datar

        //        //console.log(sdata);


        //        console.log('Data received from Db:\n');
        //        //console.log(sdata);

        //        labels = [];
        //        data = [];

        //        for (j in sdata) {
        //            //var obj = [];
        //            //for (var key in sdata[i]) {
        //            //    obj.push(sdata[i].
        //            //}

        //            if (fields.length>1) {
        //                labels.push(sdata[j][fields[0].name]);
        //                data.push(sdata[j][fields[1].name]);
        //            } else {
        //                data.push(sdata[j][fields[0].name]);
        //            }
        //        }
        //        //console.log(labels);
        //        console.log(data);

        //        send = {
        //            labs: labels,
        //            dat: data
        //        };
           
        
        //console.log(conf.charts[n].name, send);
        
        //io.emit(conf.charts[n].name, send);
        //});
    
        n++;
        }


}, 5000);



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
    con.query("SELECT Left(created,3) AS 'Day', count(tid) AS noTweets FROM tweets WHERE str_to_date(concat(substring(created,9,2),'-',substring(created,5,3),'-', right(created,4)),'%d-%M-%Y')<=curdate()AND str_to_date(concat(substring(created,9,2),'-',substring(created,5,3),'-', right(created,4)),'%d-%M-%Y')>date_add(curdate(),INTERVAL -7 DAY) GROUP By Left(created,3)", function (err, tws) {
        if (err) throw err;

        console.log('Data received from Db:\n');
        console.log(tws);
        labels = [];
        data = [];
        for (i in tws) {
            labels.push(tws[i].Day);
            data.push(tws[i].noTweets);
        }
        console.log(labels);
        console.log(data);
        send = {
            labs: labels,
            dat: data
        };

        io.emit('twpday', send);

    });

}
//setInterval(refNoTweets, 5000);
//setInterval(tweetbyday, 5000);


io.on('connection', function (socket) {
    console.log("TEST");
    io.emit('temp', 'test1');
    socket.on('test', function (data) {

        console.log(data);
        updateJSON(data);
        updateJS(data)

    });
});

function updateJS(data) {
    name = data.name;
    text = "\nsocket.on('" + name + "', function (msg) {no = msg; $('#" + name + "').html('<h1>' + no + '</h1>');});\n";
    fs.appendFile('./Public/js/index.js', text, function (err) {
        console.log(err);
    });
}

function updateJSON(data) {
    //$.getJSON("/config.json", function (data) {
    //    data.charts.push(data);
    //});

    var obj = require('./Public/config.json');
    obj.charts.push(data);
    fs.writeFile('./Public/config.json', JSON.stringify(obj), function (err) {
        console.log(err);
    });
}

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