document.getElementById("consultarBtn").addEventListener("click", function() {
    const apiUrl = 'https://criptoya.com/api/btc/ars';
    const apiUrl2 = 'https://criptoya.com/api/btc/usd';
  
    fetch(apiUrl2)
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
          document.getElementById("precio").textContent = averagePrice.toFixed(2);
        } else {
          document.getElementById("precio").textContent = 'No hay datos disponibles en ningún exchange.';
        }
      })
      .catch(error => {
        console.error('Error al obtener datos:', error);
        document.getElementById("precio").textContent = 'Error al obtener datos. Por favor, intenta de nuevo más tarde.';
      });
  });
  