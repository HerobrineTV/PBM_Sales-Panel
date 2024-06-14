async function showInputFields() {
  const functionSelect = document.getElementById('functionSelect');
  const selectedFunction = functionSelect.value;
  const inputFieldsDiv = document.getElementById('inputFields');
  //inputFieldsDiv.innerHTML = ''; // Clear previous input fields



  inputFieldsDiv.classList.toggle('hidden', !selectedFunction);
}

const inputFieldsDiv = document.getElementById('inputFields');
const functionSelect = document.getElementById('functionSelect');

const inputValues = {}; // Object to store input field values


functionSelect.addEventListener('change', () => {
  const selectedFunction = functionSelect.value;
  switch (selectedFunction) {
    case 'getSales':
      inputFieldsDiv.innerHTML = `
        <label for="username">Username:</label>
        <input type="text" id="username" required value="${inputValues['username'] || ''}">
        <label for="timeRange">Time Range:</label>
        <select id="timeRange">
          <option value="day">Day</option>https://buyme.bobac-analytics.com/script.js?v=10
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="all">All</option>
        </select>
      `;
      break;
    case 'getCardSales':
      inputFieldsDiv.innerHTML = `
        <label for="username">Username:</label>
        <input type="text" id="username" required value="${inputValues['username'] || ''}">
        <label for="cardNumber">Card Serial:</label>
        <input type="text" id="cardNumber" required value="${inputValues['cardNumber'] || ''}">
        <label for="timeRange">Time Range:</label>
        <select id="timeRange">
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="all">All</option>
        </select>
      `;
      break;
    case 'getHighestSales':
      inputFieldsDiv.innerHTML = `
        <label for="username">Username:</label>
        <input type="text" id="username" required value="${inputValues['username'] || ''}">
        <label for="timeRange">Time Range:</label>
        <select id="timeRange">
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="all">All</option>
        </select>
      `;
      break;
    default:
      inputFieldsDiv.innerHTML = ''; // No function selected
      break;
  }
});

// Save the input values when the input fields change
inputFieldsDiv.addEventListener('change', (event) => {
  if (event.target.tagName === 'INPUT' || event.target.tagName === 'SELECT') {
    inputValues[event.target.id] = event.target.value;
  }
});

function extractRobuxAmount(input) {
  // Remove any non-digit characters from the input string using regular expressions
  const robuxString = input.replace(/\D/g, '');

  // Convert the extracted string to a number and return it
  const robuxAmount = parseInt(robuxString, 10);
  return robuxAmount;
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  } else {
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  }
}

function createDetailsWindow(details) {
  const detailsWindow = document.getElementById('grid-info');
  //detailsWindow.classList.add('details-window');

	const buyerItem = document.createElement('p');
   	buyerItem.innerText = 'Buyer: ' + Object.entries(details)[1][1];
    detailsWindow.appendChild(buyerItem);
	
	const sellerItem = document.createElement('p');
   	sellerItem.innerText = 'Seller: ' + Object.entries(details)[5][1];
    detailsWindow.appendChild(sellerItem);
	
	const cardItem = document.createElement('p');
   	cardItem.innerText = 'Card: ' + Object.entries(details)[2][1] + Object.entries(details)[3][1];
    detailsWindow.appendChild(cardItem);
	
	const robuxItem = document.createElement('p');
   	robuxItem.innerText = 'Price: ' + extractRobuxAmount(Object.entries(details)[4][1])+" Robux";
    detailsWindow.appendChild(robuxItem);
	
	const timeItem = document.createElement('p');
   	timeItem.innerText = 'Time: ' + formatTimestamp(Object.entries(details)[6][1]);
    detailsWindow.appendChild(timeItem);

//console.log(Object.entries(details))

  return detailsWindow;
}


function toggleDetailsWindow(details) {
  const outputDiv = document.getElementById('grid-info');


  outputDiv.innerHTML = '';
  const detailsWindow = createDetailsWindow(details);
  outputDiv.appendChild(detailsWindow);
}

async function showSalesDetails(sales) {
  const formattedTimestamp = formatTimestamp(sales.timestamp);
  const detailsButton = document.createElement('button');
  detailsButton.innerHTML = `${formattedTimestamp} |<br> ${sales.cardName}${sales.cardNumber} |<br> ${extractRobuxAmount(sales.robuxAmount)} Robux`;
  detailsButton.addEventListener('click', () => toggleDetailsWindow(sales));
  return detailsButton;
}

async function showSalesData(data) {
  var saleamount = 0;
  var totalspent = 0;
  var average = 0;
  var buyers = {};
  const outputDiv = document.getElementById('grid-output');
  outputDiv.innerHTML = ''; // Clear previous data
  const infoDiv = document.getElementById('grid-info');
  infoDiv.innerHTML = ''; // Clear previous data

  // Sort data based on timestamp (smallest ago first)
  data.sort((a, b) => b.timestamp - a.timestamp);

  for (const sale of data) {
	saleamount += 1;
	const robuxAmount = extractRobuxAmount(sale.robuxAmount);

    if (!buyers[sale.BuyerName]) {
      buyers[sale.BuyerName] = {
        totalSpent: 0,
        totalPurchases: 0,
      };
    }

    buyers[sale.BuyerName].totalSpent += robuxAmount;
    buyers[sale.BuyerName].totalPurchases += 1;
	
	totalspent = totalspent + robuxAmount;
	
    const salesButton = await showSalesDetails(sale);
    outputDiv.appendChild(salesButton);
  }
  
    // Find the top buyer based on totalSpent
  let topBuyer = '';
  let topSpent = 0;
  let totalbuys = 0;
  for (const buyer in buyers) {
    if (buyers[buyer].totalSpent > topSpent) {
      topSpent = buyers[buyer].totalSpent;
      topBuyer = buyer;
	  totalbuys = buyers[buyer].totalPurchases
    }
  }
  
  average = totalspent/saleamount
  // Format numbers with two decimal places and thousand separators
  const formattedTotalSpent = topSpent.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedAverage = average.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedTotalPrice = totalspent.toLocaleString();

  const saleDiv = document.getElementById('SaleStats');
  saleDiv.innerHTML = `Total Price: ${formattedTotalPrice} | Avg. Price (1k+ only sells): ${formattedAverage || 0}`;
  if (topBuyer && topBuyer != '') {
    saleDiv.innerHTML += `<br> Top Buyer: ${topBuyer} spent ${formattedTotalSpent} Robux in ${totalbuys} Purchases of those Cards!`;
  }
  saleDiv.innerHTML += `<br>Click the Sales for more Info about Them!`
}

async function executeFunction() {
  const functionSelect = document.getElementById('functionSelect');
  const selectedFunction = functionSelect.value;
  const outputDiv = document.getElementById('grid-output');

  outputDiv.innerText = 'Loading...';

  switch (selectedFunction) {
    case 'getSales':
      const username = document.getElementById('username').value;
      const timeRange = document.getElementById('timeRange').value;
      try {
        const result = await fetch(`https://api.bobac-analytics.com/pbm/getSales?username=${encodeURIComponent(username)}&timeRange=${encodeURIComponent(timeRange)}`);
        const data = await result.json();
        showSalesData(data); // Create and display buttons for the response data
      } catch (error) {
        outputDiv.innerText = 'Error: Failed to fetch data from the server.';
      }
      break;
    case 'getCardSales':
      const username2 = document.getElementById('username').value;
      const cardNumber = document.getElementById('cardNumber').value;
      const timeRange2 = document.getElementById('timeRange').value;
      try {
        const result2 = await fetch(`https://api.bobac-analytics.com/pbm/getCardSales?username=${encodeURIComponent(username2)}&cardNumber=${encodeURIComponent(cardNumber)}&timeRange=${encodeURIComponent(timeRange2)}`);
        const data2 = await result2.json();
        showSalesData(data2); // Create and display buttons for the response data
      } catch (error) {
        outputDiv.innerText = 'Error: Failed to fetch data from the server.';
      }
      break;
    case 'getHighestSales':
      const username3 = document.getElementById('username').value;
      const timeRange3 = document.getElementById('timeRange').value;
	  outputDiv.innerText = 'getHighestSales comes soon!';
      try {
        const result3 = await fetch(`https://api.bobac-analytics.com/pbm/getHighestSales?username=${encodeURIComponent(username3)}&timeRange=${encodeURIComponent(timeRange3)}`);
        const data3 = await result3.json();
        showSalesData(data3); // Create and display buttons for the response data
      } catch (error) {
        outputDiv.innerText = 'Error: Failed to fetch data from the server.';
      }
      break;
    default:
      outputDiv.innerText = 'Please select a function from the dropdown.';
      break;
  }
}