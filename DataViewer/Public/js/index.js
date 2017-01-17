var noTweets = 0
var socket = io();
var tweetByDayLab = [];
var tweetByDayDat = [];

$.getJSON("http://localhost:8000/config.json", function (json) {
    console.log(json); // this will show the info it in firebug console
});

setInterval(function () {
    var date = new Date();

    var time = date.getHours() + ":" + date.getMinutes();

    $('#time').html(time);
}, 1000);

socket.on('noTweetsDay', function (msg) {
    noTweets = msg.noTw;

    $('#noTwe').html('<h1>' + noTweets + '</h1>');

});


socket.on('myChart', function (msg) {
    console.log(msg);
    tweetByDayLab = msg.labs;
    tweetByDayDat = msg.dat;
    for (z in tweetByDayDat) {
        myChart.data.datasets[0].data[z] = tweetByDayDat[z];

    }
    myChart.data.labels = tweetByDayLab;

    //myChart.data.datasets[0].data = tweetByDayDat;

    myChart.update();

});

//Rotate through divs which have an id beinging with chart
var divs = $('div[id^="chart"]').hide(),
    i = 0;

(function cycle() {

    divs.eq(i).fadeIn(400)
        .delay(10000)
        .fadeOut(400, cycle);

    i = ++i % divs.length;

})();

var ctx;
var myChart

function barChart(name) {
    ctx = document.getElementById("myChart");
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: tweetByDayLab,
            datasets: [{
                label: '# of Votes',
                data: tweetByDayDat,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            resposive: true
        }
    });
}

barChart("n");
socket.on('MSTEST', function (msg) {no = msg; $('#MSTEST').html('<h1>' + no + '</h1>');});
