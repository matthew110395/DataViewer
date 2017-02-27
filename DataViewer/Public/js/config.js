﻿var socket = io();
var chartName = [];
var chartType = [];
var names = [];
var jin = {}


$.getJSON("http://localhost:8000/config.json", function (json) {
    // this will show the info it in firebug console
    jin = json;
    for (x in json.charts) {
        chartName.push(json.charts[x].name);
        $('#accordian').append('<h3>' + json.charts[x].name + "</h3><div class='wrap'><h5>" + json.charts[x].type + "</h5><div id='edit" + json.charts[x].name + "'></div><button type='button' id='submit' onclick=" + '"' + "remove('" + json.charts[x].name + "','" + json.charts[x].type+"')" + '"' + " class='ui-button ui-widget ui-corner-all'>Delete</button></div>");
        //$('#accordian').append("<h5>" + json.charts[x].type + '</h5>');
        //$('#accordian').append("<div id='edit" + json.charts[x].name + "'></div></div>");
        window[json.charts[x].name] = ace.edit('edit' + json.charts[x].name);
        window[json.charts[x].name].getSession().setMode("ace/mode/mysql");
        window[json.charts[x].name].setOptions({
            autoScrollEditorIntoView: true,
            maxLines: 8,
            minLines: 1
        });
        window[json.charts[x].name].getSession().setUseWrapMode(true);

        window[json.charts[x].name].renderer.setShowGutter(true);
        window[json.charts[x].name].renderer.setScrollMargin(10, 10, 10, 10);
        window[json.charts[x].name].setValue(json.charts[x].csql);


    }
});

function addTo() {
    charn = $("#cname").val();
    chty = $("#type").val();
    charsql = $("#sql").val();
    if (!charn) {
        alert("Enter a ChartName");
        $("#errName").html("Enter Chart Name");
    } else if (!charsql) {
        alert("Enter SQL for " + charn);
        $("#errSQL").html("Enter SQL");
    }
    else {


       
        //alert(); // or session.getValue

        //alert(charn);
        //alert(chty);
        //alert(sql);
        chartName.push(charn);


        data = { name: charn, type: chty, csql: charsql };
        socket.emit('append', data);
    }
}
function remove(cname,ctype) {
    console.log(cname);
    obj = {
        name: cname,
        type: ctype
    };
    socket.emit('remove', obj);
}
$(function () {
    $("#accordian").accordion({
        collapsible: true
    
    });
});
//var editor = ace.edit("editor");
//editor.setTheme("ace/theme/monokai");
//editor.getSession().setMode("ace/mode/javascript");

//var editor = ace.edit("editor");
//editor.getSession().setMode("ace/mode/mysql");
//editor.setOptions({
//    autoScrollEditorIntoView: true,
//    maxLines: 8,
//    minLines:3
//});
//editor.renderer.setShowGutter(false);
//editor.renderer.setScrollMargin(10, 10, 10, 10);

socket.on('temp', function (data) {
    
    
});