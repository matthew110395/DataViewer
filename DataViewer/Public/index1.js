var noTweets = 0
var socket = io();
var tweetByDayLab = [];
var tweetByDayDat = [];

$.getJSON("http://matthew95.co.uk:8000/config.json", function (json) {
    console.log(json);
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

setInterval(function () {
    var date = new Date();

    var time = date.getHours() + ":" + date.getMinutes();

    $('#time').html(time);
}, 1000);

socket.on('noTweetsDay', function (msg) {
    noTweets = msg.dat[0];

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
//var divs = $('div[id^="chart"]').hide(),
var divs = $('.display').hide(),
    i = 0;

(function cycle() {

    divs.eq(i).fadeIn(400)
        .delay(10000)
        .fadeOut(400, cycle);

    i = ++i % divs.length;

})();


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

barChart("myChart", tweetByDayLab, tweetByDayDat);


socket.on('twpd', function (msg) { no = msg.dat; $('#twpd').html('<h1>' + no + '</h1>'); }); var tstsdat = [];
var tstslab = [];
barChart('tsts', tstslab, tstsdat);
socket.on('tsts', function (msg) {
    tstslab = msg.labs;
    tstsdat = msg.dat;
    for (z in tstsdat) {
        tsts.data.datasets[0].data[z] = tstsdat[z];
    }
    tsts.data.labels = tstslab;
    tsts.update();
});

var LineTestdat = [];
var LineTestlab = [];
lineChart('LineTest', LineTestlab, LineTestdat);
socket.on('LineTest', function (msg) {
    LineTestlab = msg.labs;
    LineTestdat = msg.dat;
    for (z in LineTestdat) {
        LineTest.data.datasets[0].data[z] = LineTestdat[z];
    }
    LineTest.data.labels = LineTestlab;
    LineTest.update();
});


var BlogNonBlogdat = [];
var BlogNonBloglab = [];
barChart("BlogNonBlog",BlogNonBloglab,BlogNonBlogdat);
socket.on("BlogNonBlog", function (msg) {
BlogNonBloglab = msg.labs;
BlogNonBlogdat = msg.dat;
for (z in BlogNonBlogdat) {
BlogNonBlog.data.datasets[0].data[z] = BlogNonBlogdat[z];
}
BlogNonBlog.data.labels = BlogNonBloglab;
BlogNonBlog.update();
});
var MSTest4dat = [];
var MSTest4lab = [];
polarChart('MSTest4', MSTest4lab, MSTest4dat);
socket.on('MSTest4', function (msg) {
    MSTest4lab = msg.labs;
    MSTest4dat = msg.dat;
    for (z in MSTest4dat) {
        MSTest4.data.datasets[0].data[z] = MSTest4dat[z];
    }
    MSTest4.data.labels = MSTest4lab;
    MSTest4.update();
}); 

