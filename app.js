const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/";

const dropdowns = document.querySelectorAll(".dropdown select");

//Har dropdown ke liye countryList ke options add karo
for (let select of dropdowns) {
    for (let currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;

        // Default selection set karna
        if (select.name === "from" && currCode === "USD") {
            newOption.selected = "selected";
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = "selected";
        }

        select.append(newOption);
    }
}

async function getExchangeRate(fromCurrency, toCurrency) {
    try {
        // Fetch data for the base currency
        let response = await fetch(`${BASE_URL}${fromCurrency}.json`);
        
        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the JSON data
        let data = await response.json();

        // Check if the target currency exists in the data
        if (!data[fromCurrency] || !data[fromCurrency][toCurrency]) {
            throw new Error(`Exchange rate for ${fromCurrency} to ${toCurrency} not found.`);
        }

        // Return the exchange rate
        return data[fromCurrency][toCurrency];
    } catch (error) {
        console.error("Error fetching exchange rate:", error);
        return null;
    }
}

const fromDropdown = document.querySelector("select[name='from']");
const toDropdown = document.querySelector("select[name='to']");

// Function to populate the dropdowns
function populateDropdowns() {
    for (let currencyCode in countryList) {
        // Create <option> elements
        let option1 = document.createElement("option");
        let option2 = document.createElement("option");

        // Set the values
        option1.value = currencyCode;
        option2.value = currencyCode;

        // Display currency code as text
        option1.innerText = currencyCode;
        option2.innerText = currencyCode;

        // Append to dropdowns
        fromDropdown.appendChild(option1);
        toDropdown.appendChild(option2);
    }

    // Set default selections
    fromDropdown.value = "USD"; 
    toDropdown.value = "INR";
}

// Call function to populate dropdowns
populateDropdowns();

const fromCurrency = document.querySelector("select[name='from']");
const toCurrency = document.querySelector("select[name='to']");
const fromFlag = document.querySelector(".from .select-container img");
const toFlag = document.querySelector(".to .select-container img");

// Function to update flag based on selected currency
function updateFlag(element, flagElement) {
    let currencyCode = element.value;  // Get selected currency (e.g., USD)
    let countryCode = countryList[currencyCode]; // Get country code (e.g., US)

    // If country code exists, update the flag image
    if (countryCode) {
        flagElement.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
    }
}

// Add event listeners for dropdown changes
fromCurrency.addEventListener("change", () => updateFlag(fromCurrency, fromFlag));
toCurrency.addEventListener("change", () => updateFlag(toCurrency, toFlag));

// Set initial flags when the page loads
updateFlag(fromCurrency, fromFlag);
updateFlag(toCurrency, toFlag);

const amountInput = document.querySelector(".amount input");
const exchangeRateMsg = document.querySelector(".msg");
const exchangeBtn = document.querySelector("button");

// Function to fetch exchange rate
async function getExchangeRate() {
    let amount = parseFloat(amountInput.value);
    if (isNaN(amount) || amount <= 0) {
        exchangeRateMsg.innerText = "Please enter a valid amount";
        return;
    }

    let fromCurrencyCode = fromCurrency.value.toLowerCase();
    let toCurrencyCode = toCurrency.value.toLowerCase();
    
    let apiUrl = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${fromCurrencyCode}.json`;

    try {
        let response = await fetch(apiUrl);
        let data = await response.json();
        
        if (!data[fromCurrencyCode] || !data[fromCurrencyCode][toCurrencyCode]) {
            exchangeRateMsg.innerText = "Exchange rate not available";
            return;
        }

        let exchangeRate = data[fromCurrencyCode][toCurrencyCode];
        let convertedAmount = (amount * exchangeRate).toFixed(2);

        exchangeRateMsg.innerText = `${amount} ${fromCurrency.value} = ${convertedAmount} ${toCurrency.value}`;
    } catch (error) {
        exchangeRateMsg.innerText = "Error fetching exchange rate";
        console.error("Error:", error);
    }
}

// Add event listener to button
exchangeBtn.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent form submission
    getExchangeRate();
});

// Call function once on page load to show default exchange rate
getExchangeRate();

