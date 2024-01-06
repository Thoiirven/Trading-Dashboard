// Listen Date Selecotr
const periodSelector = document.getElementById('periodSelector');

periodSelector.addEventListener('change', function() {
  updateDataByDate(this.value);
});


function updateDataByDate(selectedPeriod) { 
  const userIdSelected = document.getElementById('usersSelector').value;
  switch (selectedPeriod) {
    case 'week':
      read_transaction_CSV('transactions' + userIdSelected + '.csv', [subtractDaysFromDate(7)])
      read_solde_CSV('solde' + userIdSelected + '.csv', [subtractDaysFromDate(7)])
      break;
    case 'month':
      read_transaction_CSV('transactions' + userIdSelected + '.csv', [subtractDaysFromDate(30)])
      read_solde_CSV('solde' + userIdSelected + '.csv', [subtractDaysFromDate(30)])
      break;
    case 'year':
      read_transaction_CSV('transactions' + userIdSelected + '.csv', [subtractDaysFromDate(365)])
      read_solde_CSV('solde' + userIdSelected + '.csv', [subtractDaysFromDate(365)])
      break;
    default:
      break;
  }
}

// Listen User selector
const userSelector = document.getElementById('usersSelector');

userSelector.addEventListener('change', function() {
  updateDataByUser(this.value);
});

function updateDataByUser(selectedUser){
  $("#transactionsContent").empty();
  update_value_gain('transactions' + selectedUser + '.csv')
  const periodSelector = document.getElementById('periodSelector').value;
  switch (periodSelector) {
    case 'week':
      read_solde_CSV('solde' + selectedUser + '.csv', [subtractDaysFromDate(7)])
      read_transaction_CSV('transactions' + selectedUser + '.csv', [subtractDaysFromDate(7)])
      read_wallet_CSV('wallet' + selectedUser + '.csv')
      break;
    case 'month':
      read_solde_CSV('solde' + selectedUser + '.csv', [subtractDaysFromDate(30)])
      read_transaction_CSV('transactions' + selectedUser + '.csv', [subtractDaysFromDate(30)])
      read_wallet_CSV('wallet' + selectedUser + '.csv')
      break;
    case 'year':
      read_solde_CSV('solde' + selectedUser + '.csv', [subtractDaysFromDate(365)])
      read_transaction_CSV('transactions' + selectedUser + '.csv', [subtractDaysFromDate(365)])
      read_wallet_CSV('wallet' + selectedUser + '.csv')
      break;
    default:
      break;
  }

}

function getRandomData() {
  return cryptoData.map(item => Math.random() * 100);
}

function subtractDaysFromDate(days) {
  let currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - days);

  return formatDate(currentDate)
}

function formatDate(date) {
  // Format the date as DD/MM/YYYY
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}


function update_value_gain(file){
  var gain_month = document.getElementById("gain_month");
  var gain_year = document.getElementById("gain_year");
  var gain_all = document.getElementById("gain_all");
  let value_all = 0;
  let value_month = 0;
  let value_year = 0;

  fetch('../data/transactions/' + file)
      .then(response => response.text())
      .then(data => {
          const rows = data.split('\n');
          // Process each row (starting from the second row)
          for (let i = 1; i < rows.length; i++) {
              const rowData = rows[i].split(';');
              if (rowData[0]) { 
                const maxRangeDateMonth = new Date(subtractDaysFromDate(30).split('/').reverse().join('/'));
                const maxRangeDateYear= new Date(subtractDaysFromDate(365).split('/').reverse().join('/'));
                const currentDate = new Date(rowData[12].split('/').reverse().join('/'));
                value_all += parseFloat(rowData[8]);
                if(maxRangeDateMonth < currentDate) {
                  value_month = value_all
                }
                if(maxRangeDateYear < currentDate) {
                  value_year = value_all
                }
              }
          }
          if (gain_month) {
            gain_month.textContent = value_month.toFixed(2) + " $";
          }
          if (gain_year) {
            gain_year.textContent = value_year.toFixed(2) + " $";
          }
          if (gain_all) {
            gain_all.textContent = value_all.toFixed(2) + " $";
          }
      })
      .catch(error => {
          console.error('Error reading CSV file:', error);
      });

}
update_value_gain('transactions1.csv');
