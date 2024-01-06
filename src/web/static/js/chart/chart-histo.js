// Assuming you have Chart.js included in your HTML file

// Provided data
var cryptoData = [
  { name: "USDT", symbol: "USDT", quantity: 1500.0 },
  { name: "Avalanche", symbol: "AVAXUSDT", quantity: Math.random() * 100 },
  { name: "Axie Infinity", symbol: "AXSUSDT", quantity: Math.random() * 100 },
  { name: "Bitcoin", symbol: "BTCUSDT", quantity: Math.random() * 100 },
  { name: "Celer Network", symbol: "CELRUSDT", quantity: Math.random() * 100 },
  { name: "Ethereum", symbol: "ETHUSDT", quantity: Math.random() * 100 },
  { name: "Fetch.ai", symbol: "FETUSDT", quantity: Math.random() * 100 },
  { name: "Holo", symbol: "HOTUSDT", quantity: Math.random() * 100 },
  { name: "JUST", symbol: "JSTUSDT", quantity: Math.random() * 100 },
  { name: "LTO Network", symbol: "LTOUSDT", quantity: Math.random() * 100 },
  { name: "Polkastarter", symbol: "POLSUSDT", quantity: Math.random() * 100 },
  { name: "Oasis Network", symbol: "ROSEUSDT", quantity: Math.random() * 100 },
  { name: "Solana", symbol: "SOLUSDT", quantity: Math.random() * 100 },
  { name: "StormX", symbol: "STMXUSDT", quantity: Math.random() * 100 },
  { name: "Theta Fuel", symbol: "TFUELUSDT", quantity: Math.random() * 100 },
  { name: "Tellor", symbol: "TRBUSDT", quantity: Math.random() * 100 },
  { name: "Unifi Protocol DAO", symbol: "UNFIUSDT", quantity: Math.random() * 100 },
  { name: "VeChain", symbol: "VETUSDT", quantity: Math.random() * 100 },
  { name: "VeThor Token", symbol: "VTHOUSDT", quantity: Math.random() * 100 }
];


// Extracting labels and data from the provided data
var labels = cryptoData.map(item => item.name);
var data = cryptoData.map(item => Math.random() * 100); // Generating random quantities for each cryptocurrency

// Creating the bar chart
var ctx = document.getElementById("myHistoChart").getContext("2d");
var myBarChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: labels,
    datasets: [{
      label: 'Crypto Quantities',
      data: data,
      backgroundColor: '#4e73df', // Bar color
      borderColor: '#4e73df', // Border color
      borderWidth: 1
    }]
  },
  options: {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true
      }
    },
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
  }
});