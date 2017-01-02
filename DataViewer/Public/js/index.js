var noTweets = 0
var socket = io();

setInterval(function () {
    var date = new Date();

    var time = date.getHours() + ":" + date.getMinutes();

    $('#time').html(time);
}, 1000);

socket.on('noTw', function (msg) {
    noTweets = msg;

    $('#noTwe').html('<h1>' + noTweets + '</h1>');

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

var ctx = document.getElementById("myChart");
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
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
