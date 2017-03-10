var noTweets = 0
var socket = io();
var tweetByDayLab = [];
var tweetByDayDat = [];

$.getJSON("http://localhost:8000/config.json", function (json) {
    console.log(json);
    if (json.charts.length < 1) {
        window.location.href = "./config.html";
    }
    for (x in json.charts) {
        console.log(json.charts[x]);
    }
});

function nextDiv() {
    var i = 0;
    $('.display').each(function () {
        i++;
        $(this).val(i);

    });
    i = i + 1;
    var next = "chart" + i;

    return next;
}

//setInterval(function () {
//    var date = new Date();

//    var time = date.getHours() + ":" + date.getMinutes();

//    $('#time').html(time);
//}, 1000);



socket.on('reload', function (data) {
    location.reload(true);
    alert("RELOAD");

});

    

    

//Rotate through divs which have an id beinging with chart
//var divs = $('div[id^="chart"]').hide(),
//var divs = $('.display').hide(),
//    i = 0;

//(function cycle() {

//    divs.eq(i).fadeIn(400)
//        .delay(10000)
//        .fadeOut(400, cycle);

//    i = ++i % divs.length;

//})();


var myChart;
var test;

function barChart(name, lab, dat) {
    var ctx;
    ctx = document.getElementById(name);
    window[name] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: lab,
            datasets: [{
                label: 'Tweets',
                data: dat,
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
            //maintainAspectRatio: false,
            resposive: true
        }
    });

}


function polarChart(name, lab, dat) {

        var ctx;
        ctx = document.getElementById(name);
        window[name] = new Chart(ctx, {
            type: 'polarArea',
            data: {
                labels: lab,
                datasets: [{
                    label: 'Tweets',
                    data: dat,
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

                resposive: true

            }
        });
    
}

function lineChart(name, lab, dat) {
    var ctx;
    ctx = document.getElementById(name);
    window[name] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: lab,
            datasets: [{
                label: "Tweets",
                fill: false,
                lineTension: 0.1,
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: dat,
                spanGaps: false,
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
var Testdat = [];
var Testlab = [];
barChart('Test',Testlab,Testdat);
socket.on('Test', function (msg) {
Testlab = msg.labs;
Testdat = msg.dat;
for (z in Testdat) {
Test.data.datasets[0].data[z] = Testdat[z];} 
Test.data.labels = Testlab;
Test.update();}); 

socket.on('Tet', function (msg) {no = msg.dat; $('#Tet').html('<h1>' + no + '</h1>');});

socket.on('TETSTT', function (msg) { no = msg.dat; $('#TETSTT').html('<h1>' + no + '</h1>'); });



var Tweetsdat = [];
var Tweetslab = [];
barChart('Tweets',Tweetslab,Tweetsdat);
socket.on('Tweets', function (msg) {
Tweetslab = msg.labs;
Tweetsdat = msg.dat;
for (z in Tweetsdat) {
Tweets.data.datasets[0].data[z] = Tweetsdat[z];} 
Tweets.data.labels = Tweetslab;
Tweets.update();}); 

var Tweets2dat = [];
var Tweets2lab = [];
polarChart('Tweets2',Tweets2lab,Tweets2dat);
socket.on('Tweets2', function (msg) {
Tweets2lab = msg.labs;
Tweets2dat = msg.dat;
for (z in Tweets2dat) {
Tweets2.data.datasets[0].data[z] = Tweets2dat[z];} 
Tweets2.data.labels = Tweets2lab;
Tweets2.update();}); 

var tweets3dat = [];
var tweets3lab = [];
lineChart('tweets3',tweets3lab,tweets3dat);
socket.on('tweets3', function (msg) {
tweets3lab = msg.labs;
tweets3dat = msg.dat;
for (z in tweets3dat) {
tweets3.data.datasets[0].data[z] = tweets3dat[z];} 
tweets3.data.labels = tweets3lab;
tweets3.update();}); 

socket.on('test4', function (msg) {no = msg.dat; $('#test4').html('<h1>' + no + '</h1>');});
