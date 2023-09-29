// Función para obtener el precio promedio de los exchanges para BTC
async function obtenerPrecio(apiUrl) {
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
        throw new Error(`No hay datos disponibles en ningún exchange para BTC/${apiUrl.includes("usd") ? "USD" : "ARS"}.`);
      }
    } catch (error) {
      throw new Error(`Error al obtener datos para BTC/${apiUrl.includes("usd") ? "USD" : "ARS"}: ${error.message}`);
    }
  }
  
  // Función para actualizar la conversión automáticamente
  function actualizarConversion() {
    const satoshisInput = document.getElementById("satoshisInput").value;
    const conversionType = document.getElementById("conversionSlider").value;
    
    const apiUrl = conversionType == 0 ?
      'https://criptoya.com/api/btc/ars' :
      'https://criptoya.com/api/btc/usd';
  
    obtenerPrecio(apiUrl)
      .then(precio => {
        const satoshiValue = satoshisInput / 100000000;
        const conversionResult = satoshiValue * precio;
        document.getElementById("resultado").textContent = conversionResult.toFixed(2) + (conversionType == 0 ? ' ARS' : ' USD');
      })
      .catch(error => {
        console.error(error);
        document.getElementById("resultado").textContent = 'Error al realizar la conversión. Por favor, intenta de nuevo más tarde.';
      });
  }
  
  document.getElementById("satoshisInput").addEventListener("input", actualizarConversion);
  
  document.getElementById("conversionSlider").addEventListener("input", function() {
    const conversionType = document.getElementById("conversionSlider").value;
    document.getElementById("conversionType").textContent = conversionType == 0 ? 'Pesos' : 'Dólares';
  });
  