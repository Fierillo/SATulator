// Function to fetch the average price from exchanges for BTC
async function getPrice(apiUrl) {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        const prices = [
            data["lemoncash"],
            data["binance"],
            data["belo"]
        ];

        if (apiUrl.includes("usd")) {
            prices.push(data["bitso"], data["decrypto"], data["letsbit"]);
        }

        const availablePrices = prices.filter(exchange => exchange && exchange.totalAsk && exchange.totalBid);

        if (availablePrices.length > 0) {
            const totalPrices = availablePrices.reduce((total, exchange) => {
                total += (exchange.totalAsk + exchange.totalBid) / 2;
                return total;
            }, 0);

            const averagePrice = totalPrices / availablePrices.length;
            return averagePrice;
        } else {
            throw new Error(`No data available on any exchange for BTC/${apiUrl.includes("usd") ? "USD" : "ARS"}.`);
        }
    } catch (error) {
        throw new Error(`Error fetching data for BTC/${apiUrl.includes("usd") ? "USD" : "ARS"}: ${error.message}`);
    }
}

// Function to update the conversion automatically
function updateConversion() {
    const satoshisInput = document.getElementById("satoshisInput").value;
    const conversionType = document.getElementById("conversionSlider").value;

    const apiUrl = conversionType == 0 ?
        'https://criptoya.com/api/btc/ars' :
        'https://criptoya.com/api/btc/usd';

    getPrice(apiUrl)
        .then(price => {
            const satoshiValue = satoshisInput / 100000000;
            const conversionResult = satoshiValue * price;
            document.getElementById("resultado").textContent = conversionResult.toFixed(2) + (conversionType == 0 ? ' ARS' : ' USD');
        })
        .catch(error => {
            console.error(error);
            document.getElementById("resultado").textContent = 'Error performing the conversion. Please try again later.';
        });
}

// Update conversion every time user inputs values in the input box
document.getElementById("satoshisInput").addEventListener("input", updateConversion);
document.getElementById("conversionSlider").addEventListener("input", updateConversion);

// Change text "Pesos" | "Dollar" every time slider is pressed
document.getElementById("conversionSlider").addEventListener("input", function() {
    const conversionType = document.getElementById("conversionSlider").value;
    document.getElementById("conversionType").textContent = conversionType == 0 ? 'Pesos' : 'Dolares';
});