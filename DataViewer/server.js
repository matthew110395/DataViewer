//DataViewer Dashboard Application
//Author: Matthew Smith - 12004210

//Created as part of BSc (Hons) Computing dissertation module at University of the Highlands and Islands - 2017

//Created: April 2017
//Last Modified: April 2017

//NPM Module imports
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
var favicon = require('serve-favicon')
var path = require('path')
var Q = require('q');


//Spawn Python as a child process for machine learning
var spawn = require("child_process").spawn;
if (conf.tcheck == "1") {
    //Pass parameters from config.json file
    var p = spawn("python", ["Twitter/Spark_MLcurr.py"], data = [conf.DBServer, conf.DBUser, conf.DBPass, conf.DBName, conf.tcc, conf.tcs, conf.tat, conf.tats]);
    var notw = 0;
    p.stdout.on('data', function (data) {
        notw++;
        console.log(data.toString());
    });
    p.stdout.on('error', function (data) {
        console.log(data.toString());
    });
    p.stdout.on('end', function (data) {
        //Restart the python program if more than 20 tweets have been recived since it last restarted, else exit
        if (notw > 20) {
            console.log("Crawler Restart");
            p = spawn("python", ["Twitter/Spark_MLcurr.py"], data = [conf.DBServer, conf.DBUser, conf.DBPass, conf.DBName, conf.tcc, conf.tcs, conf.tat, conf.tats]);
        } else {
            console.log("Python EXIT Error");
        }
        console.log(data);
    });
    p.stderr.on('data', function (data) {
        fs.writeFile('log.txt', data.toString());
        console.log(data.toString());
    });
    //Send config parameters
    p.stdin.write(JSON.stringify(data));
    p.stdin.end();
}

//Connect to MySQL database specified in config file
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

//Used to get word to right of as
function getWordAt(str, pos) {

    //Convert to String
    str = String(str);
    pos = Number(pos) >>> 0;

    // uses regex to search for index to left and right
    var left = str.slice(0, pos + 1).search(/\S+$/),
        right = str.slice(pos).search(/\s/);

    //Handle special characters
    if (right < 0) {
        return str.slice(left);
    }

    //Return word extracted using index
    return str.slice(left, right + pos);

}

//Used to create a Q promise to carry out MySQL Query
function query(qer, name) {
    var deferred = Q.defer();
    //Run MySQL Query
    con.query(qer, function (err, datar, fields) {
        if (err) {
            deferred.reject(new Error(err));
        } else {
            var obj = {
                cname: name,
                data: datar,
                names: fields
            };
            deferred.resolve(obj);
        }
    });
    return deferred.promise;

}

var i = 0;

//Run Queries at a set interval (currently 5 seconds)
setInterval(function () {
    var n = 0
    //Delete cached config file
    delete require.cache[require.resolve('./Public/config.json')]
    conf = require('./Public/config.json');
    //Loop through all charts in config file
    while (n < conf.charts.length) {

        var labels = [];
        var data = [];
        var send = {};
        var sdata = [];
        //Find as in the query string
        tempstr = conf.charts[n].csql;
        var firstAs = tempstr.indexOf("AS");
        tempstr = tempstr.slice(firstAs + 2);
        var secondAs = tempstr.indexOf("AS");
        //Extract axis labels using getword at function
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
        //Create a promise containing the query
        var promise = query(conf.charts[n].csql, conf.charts[n].name);
        //Handle result from promise
        promise.then(function (values) {

            labels = [];
            data = [];

            for (j in values.data) {
                //Create array of objects to send
                if (values.names.length > 1) {
                    labels.push(values.data[j][values.names[0].name]);
                    data.push(values.data[j][values.names[1].name]);
                } else {
                    data.push(values.data[j][values.names[0].name]);
                }
            }

            send = {
                labs: labels,
                dat: data
            };

            //Sent to clients to update charts
            io.emit('ready', "");
            io.emit(values.cname, send);
        });

        n++;
    }
}, 5000);

//Client connects using socket.io
io.on('connection', function (socket) {

    //New chart event is recieved
    socket.on('append', function (datau) {

        updateJSON(datau);
        updateJS(datau);
        updateHTML(datau);

    });
    //Remove chart event is recieved
    socket.on('remove', function (datao) {

        remHTML(datao.name, datao.type, datao.ctitle);
        remJSON(datao.name, datao.type, datao.ctitle);
        remJS(datao.name, datao.type);

    });
    //Update Database event
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

        //Update config.json file
        fs.writeFile('./Public/config.json', JSON.stringify(conf),
            function (error) {
                if (error) throw error;
            });
    });
});

//Function to update index.js file when a new chart is recieved
function updateJS(data) {
    name = data.name;
    //Adds different JS dependant on the type of chart, each calls a function in the index.js file
    if (data.type === "Text") {
        text = "\nsocket.on('" + name + "', function (msg) {no = msg.dat; $('#" + name + "').html('<h1>' + no + '</h1>');});\n";
    } else if (data.type === "Bar") {
        text = "\nvar " + name + "dat = [];\nvar " + name + "lab = [];\nbarChart('" + name + "'," + name + "lab," + name + "dat);\nsocket.on('" + name + "', function (msg) {\n" + name + "lab = msg.labs;\n" + name + "dat = msg.dat;\nfor (z in " + name + "dat) {\n" + name + ".data.datasets[0].data[z] = " + name + "dat[z];} \n" + name + ".data.labels = " + name + "lab;\n" + name + ".update();}); \n";
    }
    else if (data.type === "Polar") {
        text = "\nvar " + name + "dat = [];\nvar " + name + "lab = [];\npolarChart('" + name + "'," + name + "lab," + name + "dat);\nsocket.on('" + name + "', function (msg) {\n" + name + "lab = msg.labs;\n" + name + "dat = msg.dat;\nfor (z in " + name + "dat) {\n" + name + ".data.datasets[0].data[z] = " + name + "dat[z];} \n" + name + ".data.labels = " + name + "lab;\n" + name + ".update();}); \n";
    }
    else if (data.type === "Line") {
        text = "\nvar " + name + "dat = [];\nvar " + name + "lab = [];\nlineChart('" + name + "'," + name + "lab," + name + "dat);\nsocket.on('" + name + "', function (msg) {\n" + name + "lab = msg.labs;\n" + name + "dat = msg.dat;\nfor (z in " + name + "dat) {\n" + name + ".data.datasets[0].data[z] = " + name + "dat[z];} \n" + name + ".data.labels = " + name + "lab;\n" + name + ".update();}); \n";
    }
    else if (data.type === "Pie") {
        text = "\nvar " + name + "dat = [];\nvar " + name + "lab = [];\npieChart('" + name + "'," + name + "lab," + name + "dat);\nsocket.on('" + name + "', function (msg) {\n" + name + "lab = msg.labs;\n" + name + "dat = msg.dat;\nfor (z in " + name + "dat) {\n" + name + ".data.datasets[0].data[z] = " + name + "dat[z];} \n" + name + ".data.labels = " + name + "lab;\n" + name + ".update();}); \n";
    }
    else if (data.type === "Radar") {
        text = "\nvar " + name + "dat = [];\nvar " + name + "lab = [];\nradarChart('" + name + "'," + name + "lab," + name + "dat);\nsocket.on('" + name + "', function (msg) {\n" + name + "lab = msg.labs;\n" + name + "dat = msg.dat;\nfor (z in " + name + "dat) {\n" + name + ".data.datasets[0].data[z] = " + name + "dat[z];} \n" + name + ".data.labels = " + name + "lab;\n" + name + ".update();}); \n";
    }
    else if (data.type === "Doughnut") {
        text = "\nvar " + name + "dat = [];\nvar " + name + "lab = [];\ndoughnutChart('" + name + "'," + name + "lab," + name + "dat);\nsocket.on('" + name + "', function (msg) {\n" + name + "lab = msg.labs;\n" + name + "dat = msg.dat;\nfor (z in " + name + "dat) {\n" + name + ".data.datasets[0].data[z] = " + name + "dat[z];} \n" + name + ".data.labels = " + name + "lab;\n" + name + ".update();}); \n";
    }
    //Write changes to file
    fs.appendFile('./Public/js/index.js', text, function (err) {
        console.log(err);
    });
}

//Remove from HTML file
function remHTML(data, type, title) {
    dname = data;
    //read index.html file
    fs.readFile('./Public/index.html', 'utf8', function (error, data) {
        //use jsdom to create dom environment
        jsdom.env(data, [], function (errors, window) {
            //Load jQuery
            var $ = require('jquery')(window);
            //Find text and remove dependant on chart type
            if (type == 'Text') {
                data = data.replace('<div class="display"><h3>' + title + '</h3><br><h1 id="' + dname + '">0</h1></div>', '');
                console.log('<div class="display"><h3>' + title + '</h3><br><h1 id="' + dname + '">0</h1></div>\n', '');
            } else if (type == 'Polar' || type == 'Radar') {
                style = "width:98%; height:98%"
                data = data.replace('<div class="display"><h3>' + title + '</h3><canvas id="' + dname + '" style="width:98%; height:98%"></canvas></div>\n', '');
                console.log('\n<div class="display"><h3>' + title + '</h3><canvas id="' + dname + '" style ="width:98%; height:98%"></canvas></div>\n', '');
            } else {
                data = data.replace('<div class="display"><h3>' + title + '</h3><canvas id="' + dname + '"></canvas></div>\n', '');
            }
            //Write to file
            fs.writeFile('./Public/index.html', data,
                function (error) {
                    if (error) throw error;
                });
        });
    });
    //Reload client pages
    io.emit('reload');
}

//Function to remove Javascript from index.js file
function remJS(name, type) {
    //add text to remove to an array dependant on chart type
    var text = [];
    if (type === "Text") {
        text.push("socket.on('" + name + "', function (msg) {no = msg.dat; $('#" + name + "').html('<h1>' + no + '</h1>');});");

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
    }
    else if (type === "Pie") {
        text.push('var ' + name + 'dat = [];');
        text.push('var ' + name + 'lab = [];');
        text.push("pieChart('" + name + "'," + name + "lab," + name + "dat);");
        text.push("socket.on('" + name + "', function (msg) {");
        text.push(name + 'lab = msg.labs;');
        text.push(name + 'dat = msg.dat;');
        text.push('for (z in ' + name + 'dat) {');
        text.push(name + '.data.datasets[0].data[z] = ' + name + 'dat[z];}');
        text.push(name + '.data.labels = ' + name + 'lab;');
        text.push(name + '.update();});');

    }
    else if (type === "Doughnut") {
        text.push('var ' + name + 'dat = [];');
        text.push('var ' + name + 'lab = [];');
        text.push("doughnutChart('" + name + "'," + name + "lab," + name + "dat);");
        text.push("socket.on('" + name + "', function (msg) {");
        text.push(name + 'lab = msg.labs;');
        text.push(name + 'dat = msg.dat;');
        text.push('for (z in ' + name + 'dat) {');
        text.push(name + '.data.datasets[0].data[z] = ' + name + 'dat[z];}');
        text.push(name + '.data.labels = ' + name + 'lab;');
        text.push(name + '.update();});');
    }
    else if (type === "Radar") {
        text.push('var ' + name + 'dat = [];');
        text.push('var ' + name + 'lab = [];');
        text.push("radarChart('" + name + "'," + name + "lab," + name + "dat);");
        text.push("socket.on('" + name + "', function (msg) {");
        text.push(name + 'lab = msg.labs;');
        text.push(name + 'dat = msg.dat;');
        text.push('for (z in ' + name + 'dat) {');
        text.push(name + '.data.datasets[0].data[z] = ' + name + 'dat[z];}');
        text.push(name + '.data.labels = ' + name + 'lab;');
        text.push(name + '.update();});');
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
    }

    //Read index.js file
    fs.readFile('./Public/js/index.js', 'utf8', function (error, data) {
        var regex = new RegExp('var ' + name + 'dat = [];[\s\S] *?' + name + '.update();', "m");
        //Remove data in text array
        for (x in text) {
            data = data.replace(text[x], '');
        }
        //Attempt to remove new line characters
        data = data.replace(/^\s+|\s+$/g, '');
        //Write changes to file
        fs.writeFile('./Public/js/index.js', data,
            function (error) {
                if (error) throw error;
            });
    });
    //Attemt to create gulp task to remove new lines
    gulp.task('default', function () {
        return gulp.src('./Public/js/index.js')
            .pipe(condense())
            .pipe(gulp.dest('./Public/js/'));
    });
    //Reload page
    io.emit('reload');
}
//function to search for json and remove
function remJSON(name, type, ctitle) {

    //Search for chart SQL
    for (c in conf.charts) {
        if (conf.charts[c].name == name) {
            var sql = conf.charts[c].csql;
        }

    }
    var text = [];
    //Add all possibilites to a text array
    text.push('{"name":"' + name + '","type":"' + type + '","csql":"' + sql + '","title":"' + ctitle + '"},');
    text.push(',{"name":"' + name + '","type":"' + type + '","csql":"' + sql + '","title":"' + ctitle + '"}');
    text.push('{"name":"' + name + '","type":"' + type + '","csql":"' + sql + '","title":"' + ctitle + '"}');
    text.push(',{"csql":"' + sql + '","name":"' + name + '","type":"' + type + '","title":"' + ctitle + '"}');
    text.push('{"csql":"' + sql + '","name":"' + name + '","type":"' + type + '","title":"' + ctitle + '"},');
    text.push('{"csql":"' + sql + '","name":"' + name + '","type":"' + type + '","title":"' + ctitle + '"}');

    //Read config file
    fs.readFile('./Public/config.json', 'utf8', function (error, data) {
        //Loop through array and remove
        for (x in text) {
            data = data.replace(text[x], '');
        }
        //Write changes to file
        fs.writeFile('./Public/config.json', data,
            function (error) {
                if (error) throw error;
            });

    });
    //Send reload event to clients
    io.emit('reload');
}

//Function to add new HTML to index.html
function updateHTML(data) {
    name = data.name;
    title = data.title;
    //Read index.html
    fs.readFile('./Public/index.html', 'utf8', function (error, hdata) {
        //Create DOM
        jsdom.env(hdata, [], function (errors, window) {
            //Load jQuery
            var $ = require('jquery')(window);
            $("#slide").each(function () {
                var content = $(this);
                //Set addpition dependant on chart type
                if (data.type === "Text") {
                    $(this).append("\n<div class='display'><h3>" + title + "</h3><br><h1 id='" + name + "'>0</h1></div>\n ");
                } else if (data.type === "Polar" || data.type === "Radar") {
                    $(this).append("\n<div class='display'><h3>" + title + "</h3><canvas id='" + name + "' style='width:98%; height:98%'></canvas></div>\n ");

                } else {
                    $(this).append("\n<div class='display'><h3>" + title + "</h3><canvas id='" + name + "'></canvas></div>\n ");
                }
            });
            //Write changes to file
            fs.writeFile('./Public/index.html', window.document.documentElement.outerHTML,
                function (error) {
                    if (error) throw error;
                });
        });
    });
}

//Function to add json
function updateJSON(dataj) {

    var obj;
    //Read JSON File
    fs.readFile('./Public/config.json', 'utf8', function (err, jdata) {
        if (err) {
            console.log(err);
            // handle error
            return;
        }
        //Parse as JSON Object
        obj = JSON.parse(jdata);
        obj.charts.push(dataj);
        //Write changes to file
        fs.writeFile('./Public/config.json', JSON.stringify(obj), function (err) {
            console.log(err);
        });
    });

}

//Clear logs every 10 seconds when the number of lines is greater than 1000
setInterval(function () {
    //Read File
    fs.readFile('log.txt', 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        //Set split character
        no = data.split(/\r\n|\r|\n/).length
        if (no > 1000) {
            //Remove files
            var linesExceptFirst = data.split('\n').slice(no - 1000).join('\n');
            fs.writeFile('log.txt', linesExceptFirst);
            io.emit("log", linesExceptFirst);
        } else {
            //Update log at client side
            io.emit("log", data);
        }

    });
}, 10000);

//Serve files in directories using express
app.use(express.static(__dirname + "/Public"));
app.use('/js', express.static(__dirname + '/Public/js'));
app.use('/css', express.static(__dirname + '/Public/css'));
app.use(favicon(path.join(__dirname + '/Public/favicon.ico')))

//create server
http.listen(8000, "0.0.0.0", function () {
    console.log('listening on *:8000');
    io.on('connection', function (socket) {
    });

});
