var noTweets = 0
var socket = io();
var tweetByDayLab = [];
var tweetByDayDat = [];

$.getJSON("../config.json", function (json) {
    if (json.charts.length < 1) {
        window.location.href = "./config.html";
    }
});


//function nextDiv() {
//    var i = 0;
//    $('.display').each(function () {
//        i++;
//        $(this).val(i);

//    });
//    i = i + 1;
//    var next = "chart" + i;

//    return next;
//}

setInterval(function () {
    var date = new Date();
    var minutes = date.getMinutes();
    if (minutes < 10) { minutes = "0" + minutes; }

    var time = date.getHours() + ":" + minutes;

    $('#time').html(time);
}, 1000);

//Rotate through divs which have an id beinging with chart
//var divs = $('div[id^="chart"]').hide(),
setTimeout(function () {
    var divs = $('.display').hide(),
        i = 0;

    (function cycle() {

        divs.eq(i).fadeIn(400)
            .delay(10000)
            .fadeOut(400, cycle);

        i = ++i % divs.length;

    })();
}, 1000);

socket.on('reload', function (data) {
    location.reload(true);

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
                label: lab,
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
            resposive: true,
            legend: {
                display: false
            }
        }
    });

}


function pieChart(name, lab, dat) {

        var ctx;
        ctx = document.getElementById(name);
        window[name] = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: lab,
                datasets: [{
                    label: '',
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
                
                resposive: true,
                    maintainAspectRatio: false


            }
        });
    
}
function doughnutChart(name, lab, dat) {

    var ctx;
    ctx = document.getElementById(name);
    window[name] = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: lab,
            datasets: [{
                label: '',
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

            resposive: true,
            maintainAspectRatio: false


        }
    });

}
function radarChart(name, lab, dat) {

    var ctx;
    ctx = document.getElementById(name);
    window[name] = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: lab,
            datasets: [{
                label: '',
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

            resposive: true,
            maintainAspectRatio: false,
            legend: {
                display: false
            }

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

            resposive: true,
            maintainAspectRatio: false


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
                label: "",
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
            resposive: true,
            legend: {
                display: false
            }
        }
    });

}
socket.on("ready", function (dat) {
    //console.log("READY");
    setTimeout(function () {
        $("#loading-wrapper").hide();
        //$("#main").show();
    }, 2000);
});