document.getElementById("convertirBtn").addEventListener("click", function() {
    const satoshisInput = document.getElementById("satoshisInput").value;
    const conversionType = document.getElementById("conversionSlider").value;
  
    // Función para obtener el precio promedio de los exchanges para BTC/ARS
    async function obtenerPrecioARS() {
      try {
        const apiUrlARS = 'https://criptoya.com/api/btc/ars';
        const response = await fetch(apiUrlARS);
        const data = await response.json();
  
        const prices = [
          data["lemoncash"],
          data["binance"],
          data["belo"]
        ];
  
        const availablePrices = prices.filter(exchange => exchange && exchange.totalAsk && exchange.totalBid);
  
        if (availablePrices.length > 0) {
          const totalPrices = availablePrices.reduce((total, exchange) => {
            total += (exchange.totalAsk + exchange.totalBid) / 2;
            return total;
          }, 0);
  
          const averagePrice = totalPrices / availablePrices.length;
          return averagePrice;
        } else {
          throw new Error('No hay datos disponibles en ningún exchange para BTC/ARS.');
        }
      } catch (error) {
        throw new Error(`Error al obtener datos para BTC/ARS: ${error.message}`);
      }
    }
  
    // Función para obtener el precio promedio de los exchanges para BTC/USD
    async function obtenerPrecioUSD() {
      try {
        const apiUrlUSD = 'https://criptoya.com/api/btc/usd';
        const response = await fetch(apiUrlUSD);
        const data = await response.json();
  
        const prices = [
          data["bitso"],
          data["decrypto"],
          data["letsbit"]
        ];
  
        const availablePrices = prices.filter(exchange => exchange && exchange.totalAsk && exchange.totalBid);
  
        if (availablePrices.length > 0) {
          const totalPrices = availablePrices.reduce((total, exchange) => {
            total += (exchange.totalAsk + exchange.totalBid) / 2;
            return total;
          }, 0);
  
          const averagePrice = totalPrices / availablePrices.length;
          return averagePrice;
        } else {
          throw new Error('No hay datos disponibles en ningún exchange para BTC/USD.');
        }
      } catch (error) {
        throw new Error(`Error al obtener datos para BTC/USD: ${error.message}`);
      }
    }
  
    // Función para realizar la conversión
    async function convertir() {
      try {
        const precioARS = await obtenerPrecioARS();
        const precioUSD = await obtenerPrecioUSD();
  
        const satoshiValue = satoshisInput / 100000000;
        let conversionResult = 0;
  
        if (conversionType == 0) {
          // Convertir a pesos
          conversionResult = satoshiValue * precioARS;
          document.getElementById("resultado").textContent = conversionResult.toFixed(2) + ' ARS';
        } else {
          // Convertir a dólares
          conversionResult = satoshiValue * precioUSD;
          document.getElementById("resultado").textContent = conversionResult.toFixed(2) + ' USD';
        }
      } catch (error) {
        console.error(error);
        document.getElementById("resultado").textContent = 'Error al realizar la conversión. Por favor, intenta de nuevo más tarde.';
      }
    }
  
    convertir();
  });
  
  document.getElementById("conversionSlider").addEventListener("input", function() {
    const conversionType = document.getElementById("conversionSlider").value;
    document.getElementById("conversionType").textContent = conversionType == 0 ? 'Pesos' : 'Dólares';
  });
  