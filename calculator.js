// Funcion para obtener el valor de un s�mbolo desde el widget de TradingView
function getTradingViewValue(symbol) {
    return new Promise((resolve, reject) => {
        new TradingView.widget({
            "symbol": symbol,
            "interval": "D",
            "container_id": "chart-container",
            "library_path": "/static/lightweight-charts/",
            "autosize": true,
            "studies_overrides": {}
        });

        const checkInterval = setInterval(() => {
            const chart = document.querySelector(".tv-lightweight-charts");
            if (chart) {
                clearInterval(checkInterval);
                const valor = parseFloat(chart.querySelector(".last-value").textContent);
                if (!isNaN(valor)) {
                    resolve(valor);
                } else {
                    reject(`Valor no v�lido para ${symbol}.`);
                }
            }
        }, 1000);

        setTimeout(() => {
            clearInterval(checkInterval);
            reject(`No se pudo obtener el valor de ${symbol}.`);
        }, 15000);
    });
}

// Funci�n para obtener el valor del d�lar blue y bitcoin
async function obtenerValores() {
    try {
        const symbolGGAL_BYMA = 'BCBA:GGAL'; // Reemplaza con el s�mbolo correcto de GGAL en BYMA
        const symbolGGAL_NASDAQ = 'NASDAQ:GGAL'; // Reemplaza con el s�mbolo correcto de GGAL en NASDAQ
        const symbolBTCUSD = 'INDEX:BTCUSD'; // Reemplaza con el s�mbolo correcto de BTCUSD en TradingView

        const ggalBYMA = await getTradingViewValue(symbolGGAL_BYMA);
        const ggalNASDAQ = await getTradingViewValue(symbolGGAL_NASDAQ);
        const btcUSD = await getTradingViewValue(symbolBTCUSD);

        const blueDollar = (ggalBYMA * 10) / ggalNASDAQ;
        const bitcoin = btcUSD;

        return { blueDollar, bitcoin };
    } catch (error) {
        console.error(error);
        throw new Error("Ha ocurrido un error al obtener los valores.");
    }
}

// Funci�n para convertir satoshis a pesos argentinos al tipo de cambio informal
async function convert() {
    try {
        const satoshis = document.getElementById("satoshis").value;
        const { blueDollar, bitcoin } = await obtenerValores();
        const pesos = (satoshis * bitcoin * blueDollar) / 100000000; // Asumiendo satoshis directos, no BTC

        document.getElementById("pesos").value = pesos.toFixed(2);
    } catch (error) {
        console.error(error);
        alert("Ha ocurrido un error en la conversi�n.");
    }
}

// Llama a la funci�n `convert()` cuando el DOM est� completamente cargado
document.addEventListener("DOMContentLoaded", () => {
    convert();
});
