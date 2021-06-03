(function (document, window) {

    const layout = {
        autosize: true,
        xaxis: {
            title: 'x'
        },
        yaxis: {
            title: 'f(x)'
        }
    };

    document.addEventListener("DOMContentLoaded", function () {

        // Para que aparezca el gráfico por default.
        Plotly.newPlot('plot', [{x:[0], y:[0], type: 'scatter'}], layout);

        var btnCalcular = document.getElementById("calcular");

        // Click en "Calcular" 
        btnCalcular.onclick = function () {
            //Montecarlo

            var funcion = math.parse(document.getElementById("funcion").value);
            
            var a = parseFloat(document.getElementById("a").value);
            var b = parseFloat(document.getElementById("b").value);
            var n = parseFloat(document.getElementById("N").value);
            
            var funcionAnalizada = analizarFuncion(funcion, a, b);
            var i;
            var cantPositivos = 0;
            var cantNegativos = 0;

            var puntosPositivos = { name: 'Puntos Positivos', x: [], y: [], type: 'scatter', mode: "markers", marker: { color: 'rgb(40, 193, 80)', size: 5 } };
            var puntosNegativos = { name: 'Puntos Negativos', x: [], y: [], type: 'scatter', mode: "markers", marker: { color: 'rgb(229, 69, 35)', size: 5 } };
            var puntosFuera = { name: 'Puntos Fuera', x: [], y: [], type: 'scatter', mode: "markers", marker: { color: 'rgb(200, 200, 200)', size: 5 } };

            var minimo = funcionAnalizada.min < 0 ? funcionAnalizada.min * 1.01 : 0;
            var maximo = funcionAnalizada.max * 1.01;
            var lineaMinimo = { name: 'm', x: [a, b], y: [minimo, minimo], type: 'lines', mode: "lines", line: { color: 'rgb(36, 173, 176)', width: 1 } };
            var lineaMaximo = { name: 'M', x: [a, b], y: [maximo, maximo], type: 'lines', mode: "lines", line: { color: 'rgb(36, 173, 176)', width: 1 } };

            for (i = 0; i < n; i++) {

                var xi = math.random(a, b);
                var yi = math.random(minimo, maximo);
                var fxi = parseFloat(funcion.evaluate({ x: xi }).toString());

                if(yi > 0 && yi <= fxi) {
                    cantPositivos++;
                    puntosPositivos.x.push(xi);
                    puntosPositivos.y.push(yi);
                } else if (yi < 0 && yi > fxi) {
                    cantNegativos++;
                    puntosNegativos.x.push(xi);
                    puntosNegativos.y.push(yi);
                }
                else{
                    puntosFuera.x.push(xi);
                    puntosFuera.y.push(yi);
                }
            }

            Plotly.newPlot('plot', [funcionAnalizada.data, puntosPositivos, puntosNegativos, puntosFuera, lineaMinimo, lineaMaximo], layout);
            document.querySelector('[data-title="Autoscale"]').click();

            var area = ((cantPositivos - cantNegativos) / n) * (b - a) * (maximo - minimo);
            document.getElementById("totalArea").textContent = "Resultado: " + area.toFixed(3);
            document.getElementById("puntosPositivos").textContent = "Puntos Positivos: " + puntosPositivos.x.length;
            document.getElementById("puntosNegativos").textContent = "Puntos Negativos: " + puntosNegativos.x.length;
            document.getElementById("puntosFuera").textContent = "Puntos Fuera: " + puntosFuera.x.length;
        };
    });

    function analizarFuncion(funcion, a, b) {
        var data = { name: 'f(x)', x: [], y: [], type: 'scatter' };
        var nk = (b - a) * 100;
        var min, max;
        var i;

        for (i = 0; i < nk; i++) {
          var xi = a + (i * ((b-a)/nk));
          var fi = parseFloat(funcion.evaluate({ x: xi }).toString());

          data.x.push(xi);
          data.y.push(fi);

          if(i == 0) {
            min = fi;
            max = fi;
          } else if (fi < min) {
            min = fi;
          } else if (fi > max) {
            max = fi;
          }
        }

        return {min: min, max: max, data: data};
    }


})(document, window);