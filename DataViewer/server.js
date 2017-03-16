

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql = require("mysql");
var fs = require('fs');
var conf = require('./Public/config.json');
var jsdom = require("jsdom");
var condense = require('gulp-condense');
var gulp = require('gulp');


var Q = require('q');


//var child = require('child_process');
//var python = child.spawn( 'python',['Twitter/Spark_MLcurr.py']);
var spawn = require("child_process").spawn;
//var spawn = require("child_process").spawn;
//var p = spawn("python", ["Twitter/Spark_MLcurr.py"], {detached: true, stdio: 'ignore'});
//p.unref();
var p = spawn("python", ["Twitter/Spark_MLcurr.py"],data = [conf.DBServer,conf.DBUser,conf.DBPass,conf.DBName,conf.tcc,conf.tcs,conf.tat,conf.tats]);

p.stdout.on('data',function(data){

    

    console.log(data.toString());
});
p.stdin.write(JSON.stringify(data));

p.stdin.end();



var con = mysql.createConnection({
    host: conf.DBServer,
    user: conf.DBUser,
    password: conf.DBPass,
    database: conf.DBName,
    charset: "utf8mb4_unicode_ci"
});
con.connect(function (err) {
    if (err) {
        console.log('Error connecting to Db');
        fs.writeFile('log.txt', err);
       
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
    conf = require('./Public/config.json');
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


            console.log(values.cname, send);
            io.emit('ready',"");
            io.emit(values.cname, send);
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

    socket.on('va', function (sql) {
        con.query(sql, function (err, datar, fields) {
            if (err) {
                socket.emit('sqlval', false);
            } else {
                socket.emit('sqlval', true);
            }
        });
    });
 
    console.log("TEST");
    io.emit('temp', 'test1');
    socket.on('append', function (data) {

        console.log(data);
        updateJSON(data);
        updateJS(data);
        updateHTML(data);

    });
    socket.on('remove', function (data) {

        remHTML(data.name,data.type,data.title );
        remJSON(data.name,data.type,data.sql);
        remJS(data.name, data.type);

    });
    socket.on('DBUP', function (data) {

            conf.DBServer = data.server;
            conf.DBName = data.dname;
            conf.DBUser = data.user;
            conf.DBPass = data.password;
            conf.tcheck = data.twitter;
            conf.tcc = data.tconskey;
            conf.tcs = data.tconssec;
            conf.tat = data.taccesst;
            conf.tats = data.taccesssec;
            

          

            fs.writeFile('./Public/config.json', JSON.stringify(conf),
                function (error) {
                    if (error) throw error;
                });




        

    });
});

function updateJS(data) {
    name = data.name;
    if (data.type === "Text") {
        text = "\nsocket.on('" + name + "', function (msg) {no = msg.dat; $('#" + name + "').html('<h1>' + no + '</h1>');});\n";
    } else if(data.type === "Bar") {
        text = "\nvar " + name + "dat = [];\nvar " + name + "lab = [];\nbarChart('" + name + "'," + name + "lab," + name + "dat);\nsocket.on('" + name + "', function (msg) {\n"+name+"lab = msg.labs;\n"+name+"dat = msg.dat;\nfor (z in "+name+"dat) {\n"+name+".data.datasets[0].data[z] = "+name+"dat[z];} \n"+name+".data.labels = "+name+"lab;\n"+name+".update();}); \n";
    }
     else if (data.type === "Polar") {
    text = "\nvar " + name + "dat = [];\nvar " + name + "lab = [];\npolarChart('" + name + "'," + name + "lab," + name + "dat);\nsocket.on('" + name + "', function (msg) {\n" + name + "lab = msg.labs;\n" + name + "dat = msg.dat;\nfor (z in " + name + "dat) {\n" + name + ".data.datasets[0].data[z] = " + name + "dat[z];} \n" + name + ".data.labels = " + name + "lab;\n" + name + ".update();}); \n";
    }
    else if (data.type === "Line") {
        text = "\nvar " + name + "dat = [];\nvar " + name + "lab = [];\nlineChart('" + name + "'," + name + "lab," + name + "dat);\nsocket.on('" + name + "', function (msg) {\n" + name + "lab = msg.labs;\n" + name + "dat = msg.dat;\nfor (z in " + name + "dat) {\n" + name + ".data.datasets[0].data[z] = " + name + "dat[z];} \n" + name + ".data.labels = " + name + "lab;\n" + name + ".update();}); \n";
    }
    fs.appendFile('./Public/js/index.js', text, function (err) {
        console.log(err);
    });
}


function remHTML(data,typ,title) {
    dname = data;
    fs.readFile('./Public/index.html', 'utf8', function (error, data) {
        jsdom.env(data, [], function (errors, window) {
            var $ = require('jquery')(window);
            if (type == 'Text') {
                data = data.replace("<div class='display'><h3>" + title + "</h3><br/><h1 id='" + dname + "'>0</h1></div>\n", '');

            } else if (type == 'Polar') {
                style = "width:98%; height:98%"
                data = data.replace("<div class='display'><h3>" + title + "</h3><canvas id='" + dname + "' style ='width:98%; height:98%'></canvas></div>\n", '');
            } else    {
                data = data.replace("<div class='display'><h3>"+title+"</h3><canvas id='" + dname + "'></canvas></div>\n", '');
            }
            //console.log($('#' + dname).closest("canvas"));
            fs.writeFile('./Public/index.html',data,
                function (error) {
                    if (error) throw error;
                });
        });
    });
    io.emit('reload');
}
function remJS(name,type) {
    //Look at add and remove, dependant on type
    var text = [];
    if (type === "Text") {
        text.push("socket.on('" + name + "', function (msg) { no = msg.dat; $('#" + name + "').html('<h1>' + no + '</h1>'); });");

           } else if (type === "Bar") {
        text.push('var ' + name + 'dat = [];');
        text.push('var ' + name + 'lab = [];');
        text.push("barChart('" + name + "'," + name + "lab," + name + "dat);");
        text.push("socket.on('" + name + "', function (msg) {");
        text.push(name + 'lab = msg.labs;');
        text.push(name + 'dat = msg.dat;');
        text.push('for (z in ' + name + 'dat) {');
        text.push(name + '.data.datasets[0].data[z] = ' + name + 'dat[z];}');
        text.push(name + '.data.labels = ' + name + 'lab;');
        text.push(name + '.update();});');




        //text = '/var ' + name + 'dat = [];[\\s\\S]var ' + name + 'dat = [];/gm';
        //text = '/var ' + name + 'dat = []; var ' + name + 'lab = [];[/s/S]+/m';
        //\nbarChart("' + name + '", ' + name + 'lab, ' + name + 'dat); \nsocket.on("' + name + '", function (msg) { \n' + name + 'lab = msg.labs; \n' + name + 'dat = msg.dat; \nfor(z in ' + name + 'dat) {\n' + name + '.data.datasets[0].data[z] = ' + name + 'dat[z]; \n } \n' + name + '.data.labels = ' + name + 'lab; \n' + name + '.update(); \n }); ';
    }
    else if (type === "Polar") {
        text.push('var ' + name + 'dat = [];');
        text.push('var ' + name + 'lab = [];');
        text.push("polarChart('" + name + "'," + name + "lab," + name + "dat);");
        text.push("socket.on('" + name + "', function (msg) {");
        text.push(name + 'lab = msg.labs;');
        text.push(name + 'dat = msg.dat;');
        text.push('for (z in ' + name + 'dat) {');
        text.push(name + '.data.datasets[0].data[z] = ' + name + 'dat[z];}');
        text.push(name + '.data.labels = ' + name + 'lab;');
        text.push(name + '.update();});');

        //text = "\nvar " + name + "dat = [];\nvar " + name + "lab = [];\npolarChart('" + name + "'," + name + "lab," + name + "dat);\nsocket.on('" + name + "', function (msg) {\n" + name + "lab = msg.labs;\n" + name + "dat = msg.dat;\nfor (z in " + name + "dat) {\n" + name + ".data.datasets[0].data[z] = " + name + "dat[z];\n} \n" + name + ".data.labels = " + name + "lab;\n" + name + ".update();\n}); \n";
    }
    else if (type === "Line") {
        text.push('var ' + name + 'dat = [];');
        text.push('var ' + name + 'lab = [];');
        text.push("lineChart('" + name + "'," + name + "lab," + name + "dat);");
        text.push("socket.on('" + name + "', function (msg) {");
        text.push(name + 'lab = msg.labs;');
        text.push(name + 'dat = msg.dat;');
        text.push('for (z in ' + name + 'dat) {');
        text.push(name + '.data.datasets[0].data[z] = ' + name + 'dat[z];}');
        text.push(name + '.data.labels = ' + name + 'lab;');
        text.push(name + '.update();});');
        //text = "\nvar " + name + "dat = [];\nvar " + name + "lab = [];\nlineChart('" + name + "'," + name + "lab," + name + "dat);\nsocket.on('" + name + "', function (msg) {\n" + name + "lab = msg.labs;\n" + name + "dat = msg.dat;\nfor (z in " + name + "dat) {\n" + name + ".data.datasets[0].data[z] = " + name + "dat[z];\n} \n" + name + ".data.labels = " + name + "lab;\n" + name + ".update();\n}); \n";
    }



    fs.readFile('./Public/js/index.js', 'utf8', function (error, data) {
        var regex = new RegExp('var ' + name + 'dat = [];[\s\S] *?' + name + '.update();', "m");
        for (x in text) {
            data = data.replace(text[x], '');
        }
        //data = data.replace(new RegExp('(\n){3,}', 'gim'), '\n
        data = data.replace(/^\s+|\s+$/g, '');



        
        console.log(data);
            //console.log($('#' + dname).closest("canvas"));
        fs.writeFile('./Public/js/index.js', data,
                function (error) {
                    if (error) throw error;
                });
        
    });
    gulp.task('default', function () {
        return gulp.src('./Public/js/index.js')
            .pipe(condense())
            .pipe(gulp.dest('./Public/js/'));
    });
    io.emit('reload');
}
 function remarr (arr,name, value) {
    jsdom.env(name, [], function (errors, window) {
        var $ = require('jquery')(window);
        var array = $.map(arr, function (v, i) {
            return v[name] === value ? null : v;
        });
        arr.length = 0; //clear original array
        arr.push.apply(arr, array); //push all elements except the one we want to delete

    });
    return arr;
}
function remJSON(name,type) {
    //$.getJSON("/config.json", function (data) {
    //    data.charts.push(data);
    //});

    for (c in conf.charts) {
        if (conf.charts[c].name == name) {
            var sql = conf.charts[c].csql;
        }
    
        }
    var text = [];


    text.push('{"name":"' + name + '","type":"' + type + '","csql":"' + sql + '"},');
    text.push(',{"name":"' + name + '","type":"' + type + '","csql":"' + sql + '"}');
    text.push('{"name":"' + name + '","type":"' + type + '","csql":"' + sql + '"}');
    text.push(',{"csql":"' + sql + '","name":"' + name + '","type":"' + type + '"}');
    text.push('{"csql":"' + sql + '","name":"' + name + '","type":"' + type + '"},');
    text.push('{"csql":"' + sql + '","name":"' + name + '","type":"' + type + '"}');



    fs.readFile('./Public/config.json', 'utf8', function (error, data) {
        for (x in text) {
            data = data.replace(text[x], '');
        }
        //data = data.replace(new RegExp('(\n){3,}', 'gim'), '\n');



        console.log(data);
        //console.log($('#' + dname).closest("canvas"));
        fs.writeFile('./Public/config.json', data,
            function (error) {
                if (error) throw error;
            });

    });
    io.emit('reload');
    }

   


function updateHTML(data) {
    name = data.name;
    title = data.title;
    //text = "\n<div class='display'><h1 id='" + name + "'>0</h1></div>\n";
    //fs.appendFile('./Public/js/index.js', text, function (err) {
    //    console.log(err);
    //});



    fs.readFile('./Public/index.html', 'utf8', function (error, hdata) {
        jsdom.env(hdata, [], function (errors, window) {
            var $ = require('jquery')(window);
            $("#slide").each(function () {
                var content = $(this);
                if (data.type === "Text") {
                    $(this).append("\n<div class='display'><h3>" + title + "</h3><br><h1 id='" + name + "'>0</h1></div>\n ");
                } else if (data.type ==="Polar"){
                    $(this).append("\n\n<div class='display'><h3>" + title + "</h3><canvas id='" + name +"' style='width:98%; height:98%'></canvas></div>\n ");
                
                } else {
                    $(this).append("\n<div class='display'><h3>" + title +"</h3><canvas id='"+name+"'></canvas></div>\n ");
                } 
            });

            fs.writeFile('./Public/index.html', window.document.documentElement.outerHTML,
                function (error) {
                    if (error) throw error;
                });
        });
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