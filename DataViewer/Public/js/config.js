var socket = io();
var chartName = [];
var chartType = [];
var names = [];
var jin = {}


$.getJSON("http://localhost:8000/config.json", function (json) {
    // this will show the info it in firebug console
    jin = json;
    for (x in json.charts) {
        chartName.push(json.charts[x].name);
        $('#accordian').append('<h3>' + json.charts[x].name + "</h3><div class='wrap'><h5>" + json.charts[x].type + "</h5><div id='edit" + json.charts[x].name + "'></div><button type='button' id='submit' onclick=" + '"' + "remove('" + json.charts[x].name + "','" + json.charts[x].type + "')" + '"' + " class='ui-button ui-widget ui-corner-all'>Delete</button></div>");
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
    $('#dbtit').append(json.DBName);
    $('#dserver').val(json.DBServer);
    $('#dname').val(json.DBName);
    $('#uname').val(json.DBUser);
    $('#pass').val(json.DBPass);
    //$('#tcheck').val(json.tcheck);
    if (json.tcheck == "1") {
        $('#tcheck').prop('checked', true);
    } else {
        $('#tcheck').prop('checked', false);
    }
    $('#tconsKey').val(json.tcc);
    $('#tconsSec').val(json.tcs);
    $('#taccesst').val(json.tat);
    $('#taccessts').val(json.tats);
});

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

    socket.emit('DBUP', dbdet);


}


function addTo() {
    charn = $("#cname").val();
    chty = $("#type").val();
    charsql = $("#sql").val();
    chtit = $("#ctit").val();
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


        data = { name: charn, type: chty, csql: charsql, title: chtit };
        socket.emit('append', data);
        location.reload();
    }
}
function remove(cname,ctype) {
    console.log(cname);
    obj = {
        name: cname,
        type: ctype,

    };
    socket.emit('remove', obj);
}
$(function () {
    $("#accordian").accordion({
        collapsible: true
    
    });
    $("#DB").accordion({
        collapsible: true,
        active: false

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

socket.on('reload', function (data) {
    location.reload(true);
    alert("RELOAD");
    
});
socket.on('log', function (data) {

    $("#log").html(data);

});

$("#newChar").click(function () {
    
    $("#dialog").dialog();

    $("#dialog").dialog();
    
});
$("#vlog").click(function () {

    $("#log").dialog({ height: 500, width:700});

});

$(function () {
    $("#dialog").dialog();
    $("#dialog").dialog('close');
});