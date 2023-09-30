async function convert(satoshis, conversionType) {
    const apiUrl = conversionType === 0
      ? 'https://criptoya.com/api/btc/ars'
      : 'https://criptoya.com/api/btc/usd';
  
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
  
      let exchanges = [];
      if (conversionType === 0) {
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
        return conversionResult.toFixed(2) + (conversionType === 0 ? ' ARS' : ' USD');
        //return conversionResult.toLocaleString(undefined, { minimumFractionDigits: 2, useGrouping: true, style: 'currency', currency: (conversionType == 0 ? 'ARS' : 'USD') });
      } else {
        throw new Error(`No hay datos disponibles en los exchanges para BTC/${conversionType === 0 ? 'ARS' : 'USD'}.`);
      }
    } catch (error) {
      throw new Error(`Error al realizar la conversión: ${error.message}`);
    }
  }
  
  export default convert;
  