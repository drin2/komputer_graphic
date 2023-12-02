document.addEventListener("DOMContentLoaded", function () {
    
    const canvas = document.getElementById("fractal");
    const renderBut = document.getElementById("renderButton");
    var scale = 1;
    
    function complexMultiply(a, b) {
        const real = a[0] * b[0] - a[1] * b[1];
        const imag = a[0] * b[1] + a[1] * b[0];
        return [real, imag];
    }
    
    
    function complexTan(z) {
        const realPart = (Math.sin(2 * z[0]) / (Math.cos(2 * z[0]) + Math.cosh(2 * z[1])));
        const imagPart = (Math.sinh(2 * z[1]) / (Math.cos(2 * z[0]) + Math.cosh(2 * z[1])));
        return [realPart, imagPart];
    }
    
    async function drawTanFractal() {
        while (canvas.firstChild) {
            canvas.removeChild(canvas.firstChild);
        }
        const updateInterval = 5000;
        let iterationCount = 0;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const maxIterations = 500;
        const xmin = -4/scale;
        const xmax = 4/scale;
        const ymin = -4/scale;
        const ymax = 4/scale;
        const dx = (xmax - xmin) / width;
        const dy = (ymax - ymin) / height;
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const zx = x * dx + xmin;
                const zy = y * dy + ymin;
                let n = 0;
                let tx = zx;
                let ty = zy;
                while (n < maxIterations){
                    txcur = tx;
                    tx = complexMultiply(complexTan(complexMultiply([tx, ty], [tx, ty])), [tx, ty])[0];
                    ty = complexMultiply(complexTan(complexMultiply([txcur, ty], [txcur, ty])), [txcur, ty])[1];
                    if(tx * tx + ty * ty > 4) {
                        break;
                    }
                    n++;
                }
                const brightness = Math.floor((n / maxIterations) * 100);
                const color = `hsl(${n % 360}, 100%, ${brightness}%)`;
    
                const pixel = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                pixel.setAttribute('x', x);
                pixel.setAttribute('y', y);
                pixel.setAttribute('width', 1);
                pixel.setAttribute('height', 1);
                pixel.setAttribute('fill', color);
                canvas.appendChild(pixel);
                iterationCount++;
                if (iterationCount >= updateInterval) {
                    iterationCount = 0;
                    await new Promise(resolve => setTimeout(resolve, 0));
                }
            }
        }
    }
    
    async function drawTan2Fractal() {
        while (canvas.firstChild) {
            canvas.removeChild(canvas.firstChild);
        }
        const updateInterval = 5000;
        let iterationCount = 0;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const maxIterations = 200;
        const xmin = -4/scale;
        const xmax = 4/scale;
        const ymin = -4/scale;
        const ymax = 4/scale;
        const dx = (xmax - xmin) / width;
        const dy = (ymax - ymin) / height;
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const zx = x * dx + xmin;
                const zy = y * dy + ymin;
                let n = 0;
                let tx = zx;
                let ty = zy;
                
                while (n < maxIterations){
                    txcur = tx;
                    tx = complexMultiply(complexTan(complexMultiply([tx, ty], complexMultiply([tx, ty], [tx, ty]))), [tx, ty])[0];
                    ty = complexMultiply(complexTan(complexMultiply([txcur, ty], complexMultiply([txcur, ty], [txcur, ty]))), [txcur, ty])[1];
                    if(tx * tx + ty * ty > 4) {
                        break;
                    }
                    n++;
                }
                const brightness = Math.floor((n / maxIterations) * 100);
                const color = `hsl(${n % 360}, 100%, ${brightness}%)`;
    
                const pixel = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                pixel.setAttribute('x', x);
                pixel.setAttribute('y', y);
                pixel.setAttribute('width', 1);
                pixel.setAttribute('height', 1);
                pixel.setAttribute('fill', color);
                canvas.appendChild(pixel);
                iterationCount++;
                if (iterationCount >= updateInterval) {
                    iterationCount = 0;
                    await new Promise(resolve => setTimeout(resolve, 0));
                }
            }
        }
    }
    
    function saveSvgAsImage() {
        if(document.getElementById('colors-page').style.display === 'grid'){ 
            var canvas = document.getElementById('canvasColors');
            var dataUrl = canvas.toDataURL();
            var link = document.createElement('a');
            link.download = 'colors_image.png';
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        else if (document.getElementById('fractals-page').style.display === 'grid') {
            const svg = document.getElementById('fractal');
            const svgData = new XMLSerializer().serializeToString(svg);
            const blob = new Blob([svgData], { type: "image/svg+xml" });
            const element = document.createElement("a");
            element.download = "w3c.svg";
            element.href = window.URL.createObjectURL(blob);
            element.click();
            element.remove();
        }else {
            var canvas = document.getElementById('movementCanvas');
            var dataUrl = canvas.toDataURL();
            var link = document.createElement('a');
            link.download = 'movement_image.png';
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        
    }
      
    document.getElementById('saveSVGButton').addEventListener('click', saveSvgAsImage);
    
    const iterationsValue = document.querySelector("#iterationsValue");
    const iterationsInput = document.querySelector("#iterations");
    const scaleValue = document.querySelector("#scaleValue");
    scaleValue.textContent = 1;
    const scaleInput = document.querySelector("#scale");
    iterationsValue.textContent = iterationsInput.value;
    const divisionRatioInput = document.querySelector("#divisionRatio");
    const divisionRatioValue = document.querySelector("#divisionRatioValue");
    divisionRatioValue.textContent = divisionRatioInput.value;
    
    divisionRatioInput.addEventListener("input", (event) => {
        divisionRatioValue.textContent = event.target.value;
        drawSnowflake();
    });
    
    iterationsInput.addEventListener("input", (event) => {
        iterationsValue.textContent = event.target.value;
    });
    
    scaleInput.addEventListener("input", (event) => {
        scaleValue.textContent = event.target.value;
        scale = event.target.value;
    });
    
    
    const fractalTypeSelect = document.querySelector("#fractalTypeSelect");
    const kochInputs = document.querySelector("#kochInputs");
    const tgInputs = document.querySelector("#tgInputs");
    const radioTriangle = document.querySelector('#radioTriangle');
    const radioCube = document.querySelector('#radioCube');
    
    
    
    fractalTypeSelect.addEventListener("change", (event) => {
        var fractalType = event.target.value;
        switch(fractalType){
            case 'koch-snowflake':
                kochInputs.hidden = false;
                tgInputs.hidden = true;
                break;
            default:
                kochInputs.hidden = true;
                tgInputs.hidden = false;
                break;
        }   
    })
    
    iterationsInput.addEventListener("input", drawSnowflake);
    
    
    function drawKochCurve(x1, y1, x2, y2, iterations) {
        if (iterations === 0) {
            return `L ${x2} ${y2} `;
        }
        const dx = x2 - x1;
        const dy = y2 - y1;
        const length = Math.sqrt(dx * dx + dy * dy);
        const spikeLength = length * divisionRatioInput.value;
        const sideLength = (length - spikeLength) / 2;
        
        const xA = x1 + dx * sideLength / length;
        const yA = y1 + dy * sideLength / length;
        
        const xB = x2 - dx * sideLength / length;
        const yB = y2 - dy * sideLength / length;
        
        const height = spikeLength / 2; 
    
        const direction = radioCube.checked ? -1 : 1;
    
        const xC = (xA + xB) / 2 - direction * height * dy / length;
        const yC = (yA + yB) / 2 + direction * height * dx / length;
    
        return drawKochCurve(x1, y1, xA, yA, iterations - 1) +
               drawKochCurve(xA, yA, xC, yC, iterations - 1) +
               drawKochCurve(xC, yC, xB, yB, iterations - 1) +
               drawKochCurve(xB, yB, x2, y2, iterations - 1);
    }
    
    
    function drawSnowflake() {
        while (canvas.firstChild) {
            canvas.removeChild(canvas.firstChild);
        }
        const iterations = parseInt(document.getElementById("iterations").value);
        const sideLength = Math.min(canvas.width.baseVal.value, canvas.height.baseVal.value) * 2 / 3;
        let pathData = "";
    
        if (radioTriangle.checked) {
            const height = sideLength * Math.sqrt(3) / 2;
            const yOffset = (canvas.height.baseVal.value - height) / 2;
            const xOffset = (canvas.width.baseVal.value - sideLength) / 2;
            pathData += `M ${xOffset} ${yOffset + height} `;
            pathData += drawKochCurve(xOffset, yOffset + height, xOffset + sideLength, yOffset + height, iterations);
            pathData += drawKochCurve(xOffset + sideLength, yOffset + height, xOffset + sideLength / 2, yOffset, iterations);
            pathData += drawKochCurve(xOffset + sideLength / 2, yOffset, xOffset, yOffset + height, iterations);
        } else if (radioCube.checked) {
            const xOffset = (canvas.width.baseVal.value - sideLength) / 2;
            const yOffset = (canvas.height.baseVal.value - sideLength) / 2;
            pathData += `M ${xOffset} ${yOffset} `;                     
            pathData += drawKochCurve(xOffset, yOffset, xOffset + sideLength, yOffset, iterations);    
            pathData += drawKochCurve(xOffset + sideLength, yOffset, xOffset + sideLength, yOffset + sideLength, iterations);
            pathData += drawKochCurve(xOffset + sideLength, yOffset + sideLength, xOffset, yOffset + sideLength, iterations);
            pathData += drawKochCurve(xOffset, yOffset + sideLength, xOffset, yOffset, iterations); 
        }
    
        const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
        pathElement.setAttribute("d", pathData);
        pathElement.setAttribute("fill", "none");
        pathElement.setAttribute("stroke", "black");
        canvas.appendChild(pathElement);
    }
    
    document.getElementById("radioTriangle").addEventListener("change", drawSnowflake);
    document.getElementById("radioCube").addEventListener("change", drawSnowflake);
    drawSnowflake();
    
    
    renderBut.addEventListener("click", () => {
        var fractalType = document.getElementById('fractalTypeSelect').value;
        switch(fractalType){
            case 'koch-snowflake':
                drawSnowflake();
                break;
            case 'tan-frac':
                drawTanFractal();
                break;
            case 'tricorn-frac':
                drawTan2Fractal();
                break;
            case 'mandelbrot-frac':
                drawMandelbrotFractal();
                break;
            default:
                break;
        }  
    }); 
    
    
    
    
    
    
    
    
    
    
    
});
    