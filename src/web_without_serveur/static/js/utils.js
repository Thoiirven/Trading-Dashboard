var dict_crypto = {
  "Bictoin": "BTCUSDT",
  "Avalanche": "AVAXUSDT"
};

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