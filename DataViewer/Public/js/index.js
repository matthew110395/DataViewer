//DataViewer Dashboard Application - Main Dashboard
//Author: Matthew Smith - 12004210

//Created as part of BSc (Hons) Computing dissertation module at University of the Highlands and Islands - 2017

//Created: April 2017
//Last Modified: April 2017

var noTweets = 0
//Initialize socket.io
var socket = io();
var tweetByDayLab = [];
var tweetByDayDat = [];

//read config file, if there are none re-direct to config screen
$.getJSON("../config.json", function (json) {
    if (json.charts.length < 1) {
        window.location.href = "./config.html";
    }
});

//Update the time every second
setInterval(function () {
    var date = new Date();
    var minutes = date.getMinutes();
    if (minutes < 10) { minutes = "0" + minutes; }

    var time = date.getHours() + ":" + minutes;

    $('#time').html(time);
}, 1000);

//Rotate through divs which belong to the display class
setTimeout(function () {
    var divs = $('.display').hide(),
        i = 0;

    (function cycle() {
        //wvery to seconds chanage screen with a 0.4 second fade
        divs.eq(i).fadeIn(400)
            .delay(10000)
            .fadeOut(400, cycle);

        i = ++i % divs.length;

    })();
}, 1000);

//if reload event is recieved, reload page
socket.on('reload', function (data) {
    location.reload(true);

});

var myChart;
var test;

//function to create bar chart when provided with name, labels and data
function barChart(name, lab, dat) {
    var ctx;
    //get chart name
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
            resposive: true,
            legend: {
                display: false
            }
        }
    });

}

//function to create pie chart when provided with name, labels and data
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

//function to create doughnut chart when provided with name, labels and data
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

//function to create radar chart when provided with name, labels and data
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
            //hide legend as shows wrong info
            legend: {
                display: false
            }

        }
    });

}

//function to create polar chart when provided with name, labels and data
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

//function to create line chart when provided with name, labels and data
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

//when data is recived, loading screen is hiden
socket.on("ready", function (dat) {
    setTimeout(function () {
        $("#loading-wrapper").hide();
    }, 2000);
});

//below this point is dynamic controlled by server.js
socket.on('ttoday', function (msg) {no = msg.dat; $('#ttoday').html('<h1>' + no + '</h1>');});
var tdatdat = [];
var tdatlab = [];
barChart('tdat',tdatlab,tdatdat);
socket.on('tdat', function (msg) {
tdatlab = msg.labs;
tdatdat = msg.dat;
for (z in tdatdat) {
tdat.data.datasets[0].data[z] = tdatdat[z];} 
tdat.data.labels = tdatlab;
tdat.update();});
var bnonbdat = [];
var bnonblab = [];
polarChart('bnonb',bnonblab,bnonbdat);
socket.on('bnonb', function (msg) {
bnonblab = msg.labs;
bnonbdat = msg.dat;
for (z in bnonbdat) {
bnonb.data.datasets[0].data[z] = bnonbdat[z];} 
bnonb.data.labels = bnonblab;
bnonb.update();}); 
