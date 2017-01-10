var socket = io();
var chartName = [];
var chartType = [];
var sql = [];
function addTo() {
    charn = $("#cname").val();
    chty = $("#type").val();
    charsql = $("#sql").val();
    //alert(charn);
    //alert(chty);
    //alert(sql);
    chartName.push(charn);
    chartType.push(chty);
    sql.push(charsql);
    data = { name: charn, type: chty, csql: charsql };
    socket.emit('test', data);

   
    alert(data);


}
socket.on('temp', function (data) {
    alert("GO");
    
});