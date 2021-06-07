(function (document, window) {

    const layout = {
        autosize: true,
        xaxis: {
            title: 't'
        },
        yaxis: {
            title: 'x'
        }
        
    };

    document.addEventListener("DOMContentLoaded", function () {
        // Grafico Vacio
        Plotly.newPlot('plot', [{x:[0], y:[0], type: 'scatter'}], layout);
        var btnCalcular = document.getElementById("calcular");

        // calclar
        btnCalcular.onclick = function () {
            var funcion = math.parse(document.getElementById("formula").value);
            var t0 = parseFloat(document.getElementById("t0").value);
            var tf = parseFloat(document.getElementById("tf").value);
            var x0 = parseFloat(document.getElementById("x0").value);
            var N = parseFloat(document.getElementById("N").value);
            var h = (tf - t0) / N;
            funcion.evaluate({ t: 0, x: 0 });
            var eulerData = euler(funcion, x0, t0, tf, h);
            var EluerMejoradoData = eulerMejorado(funcion, x0, t0, tf, h);
            var rungeKuttaData = rungeKutta(funcion, x0, t0, tf, h);
            Plotly.newPlot('plot', [eulerData, EluerMejoradoData, rungeKuttaData], layout);
            document.querySelector('[data-title="Autoscale"]').click();
        };
    });

    // Euler
    function getEulerMejorado(funcion, xInicial, tInicial, tFinal, h) {
        var data = { name: 'Euler', x: [], y: [], type: 'scatter' };
        var x = xInicial;
        var t = tInicial;
        data.x.push(t);
        data.y.push(x);
        while (t + h <= tFinal) {
            x = x + h * parseFloat(funcion.evaluate({ t: t, x: x }).toString());
            t = t + h;
            data.x.push(t);
            data.y.push(x);
        }
        return data;
    }

    // Euler Mejorado
    function getEulerMejoradoData(funcion, xInicial, tInicial, tFinal, h) {
        var data = { name: 'Euler Mejorado', x: [], y: [], type: 'scatter' };
        var x = xInicial;
        var t = tInicial;
        data.x.push(t);
        data.y.push(x);

        while (t + h <= tFinal) {
            xfn = funcion.evaluate({ t: t, x: x });
            prediccionX = x + h * xfn;
            t = t + h;
            x = x + h / 2 * (xfn + funcion.evaluate({ t: t, x: prediccionX }));
            data.x.push(t);
            data.y.push(x);
        }
        return data;
    }

    // Runge Kutta
    function getRungeKuttaData(funcion, xInicial, tInicial, tFinal, h) {
        var data = { name: 'Runge Kutta', x: [], y: [], type: 'scatter' };
        var t = tInicial;
        var x = xInicial;
        data.x.push(t);
        data.y.push(x);
        while (t + h <= tFinal) {
            m1 = parseFloat(funcion.evaluate({ x: x, t: t }).toString());
            m2 = parseFloat(funcion.evaluate({ x: x + m1 * h / 2, t: t + h / 2 }).toString());
            m3 = parseFloat(funcion.evaluate({ x: x + m2 * h / 2, t: t + h / 2 }).toString());
            m4 = parseFloat(funcion.evaluate({ x: x + m3 * h, t: t + h }).toString());
            m = ((m1 + 2 * m2 + 2 * m3 + m4) / 6);
            x = x + m * h;
            t = t + h;
            data.x.push(t);
            data.y.push(x);
        }
        return data;
    }

    function rungeKutta(funcion, x0, t0, tf, h) {
        var data = {};
        if (document.getElementById("rungeCheck").checked) data = getRungeKuttaData(funcion, x0, t0, tf, h);
        return data;
    }

    function euler(funcion, x0, t0, tf, h) {
        var data = {};
        if (document.getElementById("eulerCheck").checked) data = getEulerMejorado(funcion, x0, t0, tf, h);
        return data;
    }

    function eulerMejorado(funcion, x0, t0, tf, h) {
        var data = {};
        if (document.getElementById("eulerMejoradoCheck").checked) data = getEulerMejoradoData(funcion, x0, t0, tf, h);
        return data;
    }

})(document, window);