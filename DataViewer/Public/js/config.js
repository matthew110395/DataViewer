//DataViewer Dashboard Application - config screen
//Author: Matthew Smith - 12004210

//Created as part of BSc (Hons) Computing dissertation module at University of the Highlands and Islands - 2017

//Created: April 2017
//Last Modified: April 2017

//Initialize socket.io
var socket = io();
var chartName = [];
var chartType = [];
var names = [];
var jin = {}

//Update the time every second
setInterval(function () {
    var date = new Date();
    var minutes = date.getMinutes();
    if (minutes < 10) { minutes = "0" + minutes; }

    var time = date.getHours() + ":" + minutes;

    $('#time').html(time);
}, 1000);

//Read config file
$.getJSON("/config.json", function (json) {
    jin = json;
    //for each charts in the config file
    for (x in json.charts) {
        chartName.push(json.charts[x].name);
        //Add charts to accordian
        $('#accordian').append('<h3>' + json.charts[x].name + "</h3><div class='wrap'><h5>" + json.charts[x].type + "</h5><form><textarea name='vsql' id='vsql' cols='40' rows='6' class='form-control rea' disabled>" + json.charts[x].csql + "</textarea></form><button type='button' id='submit' onclick=" + '"' + "remove('" + json.charts[x].name + "','" + json.charts[x].type + "','" + json.charts[x].title + "')" + '"' + " class='ui-button ui-widget ui-corner-all' > Delete</button ></div > ");

    }
    //Show Database information
    $('#dbtit').append(json.DBName);
    $('#dserver').val(json.DBServer);
    $('#dname').val(json.DBName);
    $('#uname').val(json.DBUser);
    $('#pass').val(json.DBPass);
    //Set check box for Twitter data collection
    if (json.tcheck == "1") {
        $('#tcheck').prop('checked', true);
    } else {
        $('#tcheck').prop('checked', false);
    }
    //Set Twitter infromation
    $('#tconsKey').val(json.tcc);
    $('#tconsSec').val(json.tcs);
    $('#taccesst').val(json.tat);
    $('#taccessts').val(json.tats);
});

//Function to send new Database and Twitter information to the server
function DBup() {
    serv = $('#dserver').val();
    name = $('#dname').val();
    uname = $('#uname').val();
    pass = $('#pass').val();
    if ($('#tcheck').prop("checked")) {
        twitter = "1";
    } else {
        twitter = "0";
    }
    tconskey = $('#tconsKey').val();
    tconssec = $('#tconsSec').val();
    taccesst = $('#taccesst').val();
    taccesssec = $('#taccessts').val();
    //Create a JSON object with the values
    dbdet = {
        server: serv,
        dname: name,
        user: uname,
        password: pass,
        twitter: twitter,
        tconskey: tconskey,
        tconssec: tconssec,
        taccesst: taccesst,
        taccesssec: taccesssec
    };
    //Send to server using Socket.io
    socket.emit('DBUP', dbdet);

}

//Function to send new chart information to server
function addTo() {
    charn = $("#cname").val();
    chty = $("#type").val();
    charsql = $("#sql").val();
    chtit = $("#ctit").val();
    //Some validation, most carried out validator.js
    if (!charn) {
        alert("Enter a ChartName");
    } else if (!charsql) {
        alert("Enter SQL for " + charn);
    }
    else {

        chartName.push(charn);
        //Create JSON object with new chart info
        data = { name: charn, type: chty, csql: charsql, title: chtit };
        //Send to server
        socket.emit('append', data);
        //Reload page
        location.reload();
    }
}
//Function to remove charts
function remove(cname, ctype, ctitle) {
    //Create JSON object with chart information
    obj = {
        name: cname,
        type: ctype,
        ctitle: ctitle

    };
    //Send to server
    socket.emit('remove', obj);
}
//Load accordian with features
$(function () {
    $("#accordian").accordion({
        collapsible: true,
        autoHeight: true

    });
    $("#DB").accordion({
        collapsible: true,
        active: false

    });
});

//When reload is recieved reload the page
socket.on('reload', function (data) {
    location.reload(true);

});
//Append to log
socket.on('log', function (data) {

    $("#log").html(data);

});
//show dialog when new chart button is clicked
$("#newChar").click(function () {

    $("#dialog").dialog();

    $("#dialog").dialog();

});
//show log when it is clicked
$("#vlog").click(function () {

    $("#log").dialog({ height: 500, width: 700 });

});
//Close dialog function
$(function () {
    $("#dialog").dialog();
    $("#dialog").dialog('close');
});