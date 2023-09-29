document.getElementById("convertirBtn").addEventListener("click", function() {
    const satoshisInput = document.getElementById("satoshisInput").value;
  
    // Verificar que se haya ingresado un valor válido
    if (!satoshisInput || isNaN(satoshisInput) || satoshisInput <= 0) {
      document.getElementById("resultado").textContent = 'Por favor, ingrese un valor válido en satoshis.';
      return;
    }
  
    const apiUrl = 'https://criptoya.com/api/btc/ars';
  
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const prices = [
          data["binance"],
          data["lemoncash"],
          data["belo"]
        ];
  
        const availablePrices = prices.filter(exchange => exchange && exchange.totalAsk && exchange.totalBid);
  
        if (availablePrices.length > 0) {
          const totalPrices = availablePrices.reduce((total, exchange) => {
            total += (exchange.totalAsk + exchange.totalBid) / 2;
            return total;
          }, 0);
  
          const averagePrice = totalPrices / availablePrices.length;
          const pesosArgentinos = (satoshisInput / 100000000) * averagePrice;
          document.getElementById("resultado").textContent = pesosArgentinos.toFixed(2) + ' ARS';
        } else {
          document.getElementById("resultado").textContent = 'No hay datos disponibles en ningún exchange.';
        }
      })
      .catch(error => {
        console.error('Error al obtener datos:', error);
        document.getElementById("resultado").textContent = 'Error al obtener datos. Por favor, intenta de nuevo más tarde.';
      });
  });