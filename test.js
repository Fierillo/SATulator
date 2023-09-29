const apiKey = ''; // Reemplaza con tu clave de API de Alpha Vantage

const apiUrl = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=USD&apikey=${apiKey}`;
const apiUrl2 = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=GGAL.BA&apikey=${apiKey}`

fetch(apiUrl2)
  .then(response => response.json())
  .then(data => {
    // Obtener el último precio de cierre de la respuesta JSON
    //const lastPrice = data['Realtime Currency Exchange Rate']['5. Exchange Rate'];
    const lastPrice = data['Global Quote']['05. price'];

    // Mostrar el precio en la consola
    console.log(`El último precio de Bitcoin es: ${lastPrice}`);
  })
  .catch(error => {
    // Manejar errores en la solicitud
    console.error('Error al obtener datos:', error);
  });