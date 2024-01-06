// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

// Provided data
var cryptoData = [
];

var colorPalette = [
    '#1f78b4', '#33a02c', '#e31a1c', '#ff7f00', '#6a3d9a',
    '#b15928', '#a6cee3', '#b2df8a', '#fb9a99', '#fdbf6f',
    '#cab2d6', '#8da0cb', '#b3de69', '#fccde5',
    '#d62728', '#9467bd', '#8c564b', '#c49c94', '#e377c2'
];

// Filter out items with quantity === 0
var filteredCryptoData = cryptoData.filter(item => item.quantity !== 0);

var labels = [];
var data = [];
var colors = filteredCryptoData.map(item => '#' + Math.floor(Math.random()*16777215).toString(16));


var ctx = document.getElementById("myPieChart").getContext("2d");
var myPieChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: labels,
        datasets: [{
            data: data,
            backgroundColor: colorPalette,
            hoverBackgroundColor: colorPalette,
            hoverBorderColor: "rgba(234, 236, 244, 1)",
        }],
    },
    options: {
        maintainAspectRatio: false,
        tooltips: {
            backgroundColor: "rgb(255,255,255)",
            bodyFontColor: "#858796",
            borderColor: '#dddfeb',
            borderWidth: 1,
            xPadding: 15,
            yPadding: 15,
            displayColors: false,
            caretPadding: 10,
        },
        legend: {
            display: false
        },
    },
});

var legendContainer = document.querySelector(".legend-container");
filteredCryptoData.forEach((item, index) => {
    var legendItem = document.createElement("div");
    legendItem.classList.add("legend-item");
    legendItem.style.color = colorPalette[index % colorPalette.length]; // Use a looping index for colors
    legendItem.innerHTML = `<i class="fas fa-circle"></i> ${item.name}`;
    legendContainer.appendChild(legendItem);
});