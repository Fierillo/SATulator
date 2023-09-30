// Call convert function everytime that values are input.
document.getElementById("satoshisInput").addEventListener("input", convert);
document.getElementById("conversionSlider").addEventListener("input", convert);

// Change text "Pesos" | "Dolares" every time slider is pressed.
document.getElementById("conversionSlider").addEventListener("input", function() {
    const conversionType = document.getElementById("conversionSlider").value;
    document.getElementById("conversionType").textContent = conversionType == 0 ? 'Pesos' : 'Dolares';
})

// This function convert satoshis to ARS or USD values.
async function convert() {
  const satoshis = document.getElementById("satoshisInput").value;
  const conversionType = document.getElementById("conversionSlider").value;
  const apiUrl = conversionType == 0 ?
    'https://criptoya.com/api/btc/ars' :
    'https://criptoya.com/api/btc/usd';

    // Try to get conversion rates for ARS from Lemon, Belo, Binance 
                                    // USD from Letsbit, Bitso, Decrypto
    try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    let exchanges = [];
    if (conversionType == 0) {
      exchanges = ["lemoncash", "binance", "belo"];
    } else {
      exchanges = ["letsbit", "bitso", "decrypto"];
    }

    let totalPrices = 0;
    let numberOfExchanges = 0;
    exchanges.forEach(exchange => {
      if (data[exchange] && data[exchange]["totalAsk"] && data[exchange]["totalBid"]) {
        totalPrices += (data[exchange]["totalAsk"] + data[exchange]["totalBid"]) / 2;
        numberOfExchanges++;
      }
    });

    if (numberOfExchanges > 0) {
      const averagePrice = totalPrices / numberOfExchanges;
      const satoshiValue = satoshis / 100000000;
      const conversionResult = satoshiValue * averagePrice;
      document.getElementById("resultado").textContent = conversionResult.toFixed(2) + (conversionType == 0 ? ' ARS' : ' USD');
    } else {
      throw new Error(`No hay datos disponibles en los exchanges para BTC/${conversionType == 0 ? 'ARS' : 'USD'}.`);
    }
  } catch (error) {
    console.error(error);
    document.getElementById("resultado").textContent = 'Error al realizar la conversión. Por favor, intenta de nuevo más tarde.';
  }
}