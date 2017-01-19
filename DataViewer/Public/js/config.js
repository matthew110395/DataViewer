var socket = io();
var chartName = [];
var chartType = [];
var sql = [];

function addTo() {
    charn = $("#cname").val();
    chty = $("#type").val();
    charsql = editor.getValue();
    //alert(); // or session.getValue

    //alert(charn);
    //alert(chty);
    //alert(sql);
    chartName.push(charn);
    chartType.push(chty);
    sql.push(charsql);
    data = { name: charn, type: chty, csql: charsql };
    socket.emit('append', data);
}
//var editor = ace.edit("editor");
//editor.setTheme("ace/theme/monokai");
//editor.getSession().setMode("ace/mode/javascript");

var editor = ace.edit("editor");
editor.getSession().setMode("ace/mode/mysql");
editor.setOptions({
    autoScrollEditorIntoView: true,
    maxLines: 8,
    minLines:1
});
editor.renderer.setShowGutter(false);
editor.renderer.setScrollMargin(10, 10, 10, 10);

socket.on('temp', function (data) {
    
    
});