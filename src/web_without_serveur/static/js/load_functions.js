// User selector function 
function fill_user_selector(file){
    fetch('../data/' + file)
        .then(response => response.text())
        .then(data => {
            // Call a function to process the CSV data
            process_users_CSV(data);
        })
        .catch(error => {
            console.error('Error reading CSV file:', error);
        });
}

function process_users_CSV(data){
    // Split the CSV data into rows
    const rows = data.split('\n');
    // Get the header and remove it from the rows
    const header = rows.shift().split('\t');

    // Get the index of the 'name' column
    const nameIndex = header.indexOf('name');

    // Get the select element
    const usersSelector = document.getElementById('usersSelector');

    // Loop through the rows and populate the select element
    rows.forEach(row => {
        const columns = row.split(';');
        const userId = columns[0];
        const userName = columns[1];
        // Check if null line
        if (userId) {
            // Create an option element and add it to the select element
            const option = document.createElement('option');
            option.value = userId;
            option.text = userName;
            usersSelector.add(option);
        }
    });
}

fill_user_selector('users.csv');


// Transaction Functions
function read_transaction_CSV(file, rangeDate) {
    let id = file.split("transactions")[1].trim();
    fetch('../data/transactions/' + file)
        .then(response => response.text())
        .then(data => {
            // Call a function to process the CSV data
            process_transaction_CSV(data, id, rangeDate);
        })
        .catch(error => {
            console.error('Error reading CSV file:', error);
        });
}

function process_transaction_CSV(csvData, id, rangeDate) {
    // Split the CSV data into rows
    table.innerHTML = "";
    table.clear();
    const rows = csvData.split('\n');
    // Variables
    let profitByPair = {};
    // Init the dict
    let listCrypto = []
    fetch('../data/wallets/wallet' + id)
        .then(response => response.text())
        .then(data2 => {
            const rows2 = data2.split('\n');
            for (let i = 1; i < rows2.length; i++) {
                const rowData2 = rows2[i].split(';');
                // Check if null line
                if(rowData2[0]){
                    if(rowData2[1] != "USDT") {
                        listCrypto.push(rowData2[1]);
                    }
                }
            }
            listCrypto.forEach((i) => {
                profitByPair[i] = 0.0;
            });
            // Process each row (starting from the second row)
            for (let i = (rows.length - 1); i >= 0 ; i--) {
                const rowData = rows[i].split(';');
                // Check if null line
                if (rowData[0]) { 
                    const minRangeDate = new Date(rangeDate[0].split('/').reverse().join('/'));
                    const currentDate = new Date(rowData[12].split('/').reverse().join('/'));
                    
                    if(minRangeDate <= currentDate) {
                        add_transaction(rowData);
                        profitByPair[rowData[0]] = profitByPair[rowData[0]] + parseFloat(rowData[8])
                    }
                }
            }
            update_BarChart(profitByPair)
        })
        .catch(error => {
            console.error('Error reading CSV file:', error);
        });
}

function add_transaction(data){
    var symbol = data[0];
    var side = data[6];
    var quantity = data[9]
    var price = data[7];
    var gain = data[8];
    var time = data[13];
    var date = data[12];

    table.row
        .add([
            symbol,
            side,
            quantity,
            price,
            gain,
            time,
            date
        ])
        .draw(false);
}

function update_BarChart(newData) {
    // Get the dataset of the bar chart
    let dataset = myBarChart.data.datasets[0];
    // Update values
    dataset.data = Object.values(newData);
    // Change keys 
    myBarChart.data.labels = Object.keys(newData);
    myBarChart.update();
}
// Call the function to read the CSV file
read_transaction_CSV('transactions1.csv', [subtractDaysFromDate(7), formatDate(new Date())]);


// Solde functions
function read_solde_CSV(file, rangeDate) {
    fetch('../data/soldes/' + file)
        .then(response => response.text())
        .then(data => {
            // Call a function to process the CSV data
            process_solde_CSV(data, rangeDate);
        })
        .catch(error => {
            console.error('Error reading CSV file:', error);
        });
}

function process_solde_CSV(csvData, rangeDate) {
    const rows = csvData.split('\n');
    const soldeDate = [];
    const soldeBalance = [];
    // Process each row (starting from the second row)
    for (let i = 1; i < rows.length; i++) {
        const rowData = rows[i].split(';');
        const minRangeDate = new Date(rangeDate[0].split('/').reverse().join('/'));
        const currentDate = new Date(rowData[0].split('/').reverse().join('/'));

        if(minRangeDate <= currentDate) {
            soldeDate.push(rowData[0])
            soldeBalance.push(rowData[1])
        }
    }
    updateHistogramData(soldeDate, soldeBalance);
}

function updateHistogramData(soldeDate, soldeBalance) {
    myLineChart.data.labels = soldeDate;
    myLineChart.data.datasets[0].data = soldeBalance;
    myLineChart.update();
} 

read_solde_CSV('solde1.csv', [subtractDaysFromDate(7), formatDate(new Date())]);

// Wallet functions
function read_wallet_CSV(file) {
    fetch('../data/wallets/' + file)
        .then(response => response.text())
        .then(data => {
            // Call a function to process the CSV data
            process_wallet_CSV(data);
        })
        .catch(error => {
            console.error('Error reading CSV file:', error);
        });
}

function process_wallet_CSV(csvData) {
    // Split the CSV data into rows
    const rows = csvData.split('\n');
    const symbol_pie = [];
    const value_pie = [];

    let crypt_dict = [];

    let crypt_to_bar_progress = [];

    let crypto_to_marquee = [];
    // Process each row (starting from the second row)
    for (let i = 1; i < rows.length; i++) {
        const rowData = rows[i].split(';');
        // Check if null line
        if(rowData[0]){
            if(rowData[0] != "USDT" && rowData[2] != 0) {
                symbol_pie.push(rowData[0])
                value_pie.push(rowData[2] * rowData[3]) 
                crypt_dict.push({name: rowData[0], quantity: rowData[2]})
                crypt_to_bar_progress.push({name: rowData[0], quantity: rowData[2], current_price : rowData[3], price_buy : rowData[4]})                
            }
        }
        if(rowData[0] != "USDT") {
            crypto_to_marquee.push({name: rowData[0], symbol: rowData[1], current_price : rowData[3]})
        }
    }

    colors = colorPalette.slice(0, crypt_dict.length);
    
    // Update Value Pie
    myPieChart.data.labels = symbol_pie;
    myPieChart.data.datasets[0].data = value_pie;
    myPieChart.update();

    // Update Value Legend
    updateLegend(crypt_dict)

    updateTransaction(crypt_to_bar_progress)

    updateMarquee(crypto_to_marquee)
}

function updateLegend(data){
    legendContainer.innerHTML = ''; // Effacez la légende existante

    data.forEach((item, index) => {
        var legendItem = document.createElement("div");
        legendItem.classList.add("legend-item");
        legendItem.style.color = colors[index % colors.length];
        legendItem.innerHTML = `<i class="fas fa-circle"></i> ${item.name}`;
        legendContainer.appendChild(legendItem);
    });
}

function updateTransaction(data) {
    // Sélectionnez le conteneur où vous voulez ajouter les barres de progression
    var progressContainer = document.getElementById("progress-container");

    // Effacez le contenu existant du conteneur
    progressContainer.innerHTML = '';

    data.forEach(item => {
        const profit = (item.quantity * item.current_price) - (item.price_buy * item.quantity) 

        var mother_div = document.createElement("div");
        mother_div.classList.add("col-md-4");

        var div = document.createElement("div");
        div.classList.add("d-flex", "align-items-center");

        var logo = document.createElement("img")
        logo.src = "../img/logo/"+ item.name +".png"
        logo.style.width = "30px";
        logo.style.high = "30px";
        logo.style.paddingBottom = "10px";
        logo.classList.add("mr-2");

        var h3 = document.createElement("h3");
        h3.classList.add("font-weight-bold");
        h3.textContent = `${item.name}`;

        div.appendChild(logo)
        div.appendChild(h3)

        var h5 = document.createElement("h5");
        h5.classList.add("font-weight-bold");
        h5.textContent = `Profit :  ${profit.toFixed(2) + ' $'}`;

        var progressDiv = document.createElement("div");
        progressDiv.classList.add("progress", "mb-4");
        if (profit < 0) {
            progressDiv.style.transform = "rotate(180deg)";
        }

        var progressBar = document.createElement("div");
        progressBar.classList.add("progress-bar", getProgressBarColor(item), "role", "progressbar");
        progressBar.style.width = getProgressBarWidth(item);
        progressBar.style.transform = getProgressBarTranslate(item);
        progressBar.setAttribute("aria-valuenow", getProgressBarWidth(item) * 2);
        progressBar.setAttribute("aria-valuemin", "0");
        progressBar.setAttribute("aria-valuemax", "100");

        // Ajoutez les éléments au DOM
        progressDiv.appendChild(progressBar);
        mother_div.appendChild(div);
        mother_div.appendChild(h5);
        mother_div.appendChild(progressDiv);
        progressContainer.appendChild(mother_div);
    });
}

function updateMarquee(data){
    var marquee = document.getElementById("marquee");
    marquee.innerHTML = '';
     data.forEach(item => {
        if (typeof item.symbol !== 'undefined'){
            var logo = document.createElement("img")
            logo.src = "../img/logo/"+ item.name +".png"
            logo.style.width = "30px";
            logo.style.high = "30px";
            logo.style.paddingBottom = "5px";
            logo.classList.add("mr-2");

            var span = document.createElement("span")
            span.classList.add("crypto-item", "font-weight-bold")
            span.textContent = item.name +  " (" + item.symbol.replace('USDT','') + ") : " + item.current_price + " $";
            span.style.paddingRight = "15px";

            marquee.appendChild(logo)
            marquee.appendChild((span))
        }
    
     })
     data.forEach(item => {
        if (typeof item.symbol !== 'undefined'){
            var logo = document.createElement("img")
            logo.src = "../img/logo/"+ item.name +".png"
            logo.style.width = "30px";
            logo.style.high = "30px";
            logo.style.paddingBottom = "5px";
            logo.classList.add("mr-2");

            var span = document.createElement("span")
            span.classList.add("crypto-item", "font-weight-bold")
            span.textContent = item.name +  " (" + item.symbol.replace('USDT','') + ") : " + item.current_price + " $";
            span.style.paddingRight = "15px";

            marquee.appendChild(logo)
            marquee.appendChild((span))
        }
    
     })
     
}

function getProgressBarColor(item) {
    if (item.current_price < item.price_buy) {
        return "bg-danger"; // Rouge si le prix actuel est inférieur au prix d'achat
    } else {
        return "bg-success"; // Vert sinon
    }
}

function getProgressBarWidth(item) {
    value = Math.abs((item.price_buy * item.quantity) - (item.quantity * item.current_price))/2
    if (value < 1) value = 1;
    return value + "%";
}

function getProgressBarTranslate(item) {
    value_bar = Math.abs((item.price_buy * item.quantity) - (item.quantity * item.current_price))/2
    if (value_bar < 1) {
        value = 5000
    } else {
        value = 5000 / value_bar
    }
    return "translateX("+ value + "%)"
}

read_wallet_CSV('wallet1.csv')

