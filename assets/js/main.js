// funcion para llamar a la api
async function getExchanges(apiURL) {
    try {
        const res = await fetch(apiURL);
        const exchanges = await res.json();
        return exchanges;
        } catch (e) {
        alert(e.message);
        }
    }

// se crea la variable para almacenar el grafico
let myChart;

// funcion principal que se ejecuta el hacer click en el boton convertir
const btn = document.querySelector('#btn');
btn.addEventListener('click', async function(){
    // se leen los inputs y elementos del html
    const total = document.querySelector('#total');
    const phResult = document.querySelector('#phResult');
    const valorActual = document.querySelector('#valorActual');
    const inputClp = document.querySelector('#inputClp').value;
    const currency = document.querySelector('#currency').value;
    // se verifica que el input a convertir sea un numero
    if (isNaN(inputClp)) {
        // El valor del input no es un número
        alert('Ingrese un monto válido');
      } else {
        // se genera la URL para llamar a la api segun la moneda escogida en el input
        const apiURL = "https://mindicador.cl/api/" + currency;
        // se llama a la api y se guarda en la variable exchanges
        const exchanges = await getExchanges(apiURL)
        console.log(currency ,exchanges.serie[0]['valor'])
        // guardamos el valor de hoy de la moneda escogida
        const valor = exchanges.serie[0]['valor'];
        // modificamos el html para ocultar elementos y enviar los resultados. Se usa la funcion toLocaleString para cambiar el formato de los numeros
        phResult.classList.add('display-none')
        total.innerHTML = `Resultado: ${(inputClp / valor).toLocaleString("de-DE")}`;
        valorActual.innerHTML =`1 ${currency} equivale a ${(valor).toLocaleString("de-DE")} CLP`;
        // guardamos los valores para generar el grafico, en el eje x las ultimas 10 fechas, en el eje y los ultimos 10 valores. Se utiliza la funcion reverse() para que en el grafico se lea mejor
        console.log((exchanges.serie).slice(0,10))
        const dataset = (exchanges.serie).slice(0,10).reverse()
        const xValue = dataset.map(object => object.fecha)
        const yValue = dataset.map(object => object.valor)
        // se destruye el grafico para ejecuciones posteriores a la primera
        if (typeof myChart !== 'undefined') {
            myChart.destroy();
          }
        // se genera el grafico con los valores para el eje x e y
        myChart = new Chart("myChart", {
            type: "line",
            data: {
              labels: xValue,
              datasets: [{
                label: "Valor " + currency,
                background: "red",
                data: yValue
              }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: "Evolución " + currency + " últimos diez días"
                    }},
                legend: {display: false}
              }
          })
      }
    })
