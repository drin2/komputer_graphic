document.addEventListener("DOMContentLoaded", function () {

function RGBToHSV(r, g, b) {
    r /= 255, g /= 255, b /= 255;

    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max == 0 ? 0 : d / max;

    if (max == min) {
      h = 0;
    } else {
      if (max === r) {
        h = (g - b) / d + (g < b ? 6 : 0);
      } else if (max === g) {
        h = (b - r) / d + 2;
      } else {
        h = (r - g) / d + 4;
      }
  
      h /= 6;
    }

    return { h, s, v };
}

function    HSVToRGB(h, s, v) {
    var r, g, b;

    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    switch (i % 6) {
     case 0: r = v, g = t, b = p; break;
     case 1: r = q, g = v, b = p; break;
     case 2: r = p, g = v, b = t; break;
     case 3: r = p, g = q, b = v; break;
     case 4: r = t, g = p, b = v; break;
     case 5: r = v, g = p, b = q; break;
    }

    return [ r * 255, g * 255, b * 255 ];
}

function rgbToCmyk(r, g, b) {
    const red = r / 255;
    const green = g / 255;
    const blue = b / 255;

    const black = 1 - Math.max(red, green, blue);

    const cyan = (1 - red - black) / (1 - black);
    const magenta = (1 - green - black) / (1 - black);
    const yellow = (1 - blue - black) / (1 - black);

    const c = Math.round(cyan * 100);
    const m = Math.round(magenta * 100);
    const y = Math.round(yellow * 100);
    const k = Math.round(black * 100);

    return { c, m, y, k };
}

function cmykToRgb(c, m, y, k) {
    const cyan = c / 100;
    const magenta = m / 100;
    const yellow = y / 100;
    const black = k / 100;

    const red = 255 * (1 - cyan) * (1 - black);
    const green = 255 * (1 - magenta) * (1 - black);
    const blue = 255 * (1 - yellow) * (1 - black);

    return { red, green, blue };
}

const canvasColors = document.getElementById("canvasColors");
const canvasColors2 = document.getElementById("canvasColorsResult");
const ctxColors = canvasColors.getContext("2d");
const imgColors = new Image();
imgColors.src = "pexels-alexander-grey-1191710.jpg";
imgColors.onload = function() {
    ctxColors.drawImage(imgColors, 0, 0, canvasColors.width, canvasColors.height);
};

    
document.getElementById("changeColorButton").addEventListener("click", () => {
    const imageData = ctxColors.getImageData(0, 0, canvasColors.width, canvasColors.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
       const r = data[i];
       const g = data[i + 1];
       const b = data[i + 2];
       const cmyk = rgbToCmyk(r, g, b);
       const rgb1 = cmykToRgb(cmyk.c, cmyk.m, cmyk.y, cmyk.k);
       const hsv = RGBToHSV(rgb1.red, rgb1.green, rgb1.blue);
       const rgb = HSVToRGB(hsv.h, hsv.s, hsv.v);
       data[i] = rgb[0];
       data[i + 1] = rgb[1];
       data[i + 2] = rgb[2];
    }
    canvasColors2.getContext("2d").putImageData(imageData, 0, 0);
});

document.getElementById('Predmety').addEventListener('click', () => {
    document.getElementById('fractals-page').style.display = 'none';
    document.getElementById('colors-page').style.display = document.getElementById('colors-page').style.display === 'none' ? 'grid' : 'none';
    document.getElementById('movement-page').style.display = document.getElementById('movement-page').style.display === 'none' ? 'grid' : 'none';

});


const hsvText = document.getElementById("color-hsv");
const cmykText = document.getElementById("color-cmyk");
function pick(event){
    const bounding = canvasColors2.getBoundingClientRect();

    const xScale = canvasColors2.width / bounding.width;
    const yScale = canvasColors2.height / bounding.height;


    const x = (event.clientX - bounding.left) * xScale;
    const y = (event.clientY - bounding.top) * yScale;
    
    const pixel = canvasColors2.getContext("2d").getImageData(x, y, 1, 1);
    const data = pixel.data;

    const r = data[0];
    const g = data[1];
    const b = data[2];
    const cmyk = rgbToCmyk(r, g, b);

    const hsv = RGBToHSV(r, g, b);

    const cmykVal = `CMYK(${cmyk.c}, ${cmyk.m}, ${cmyk.y}, ${cmyk.k })`;
    const hsvVal = `HSV(${(hsv.h*360).toFixed()}, ${hsv.s.toFixed(2)}, ${hsv.v.toFixed(2)})`;

    cmykText.textContent = cmykVal;
    hsvText.textContent = hsvVal;
}
canvasColors2.addEventListener("click", (event) => pick(event));

document.getElementById("resetToDefault").addEventListener("click", () => {
    imgColors.src = "pexels-alexander-grey-1191710.jpg";
    imgColors.onload = function() {
        ctxColors.drawImage(imgColors, 0, 0, canvasColors.width, canvasColors.height);
    };
});

const greenSaturValue = document.querySelector("#green-saturationValue");
const greenSaturInput = document.querySelector("#green-saturation");
var greenSatur = 1;
var magentaSatur = 1;

greenSaturInput.addEventListener("input", (event) => {
    greenSaturValue.textContent = event.target.value;
    greenSatur = event.target.value;
    adjustSaturationOnCanvas(greenSatur, magentaSatur);
});

const purpleSaturValue = document.querySelector("#magenta-saturationValue");
const purpleSaturInput = document.querySelector("#magenta-saturation");
purpleSaturInput.addEventListener("input", (event) => {
    purpleSaturValue.textContent = event.target.value;
    magentaSatur = event.target.value;
    adjustSaturationOnCanvas(greenSatur, magentaSatur);

});

function isMagenta(hsv) {
    const magentaHueMin = 301; 
    const magentaHueMax = 360; 
    return hsv.h >= magentaHueMin / 360 && hsv.h <= magentaHueMax / 360;
}

function isGreen(hsv) {
    const greenHueMin = 121; 
    const greenHueMax = 180;
    return hsv.h >= greenHueMin / 360 && hsv.h <= greenHueMax / 360;
}

function adjustSaturationOnCanvas(greenSaturation, magentaSaturation) {
    const imageData = ctxColors.getImageData(0, 0, canvasColors.width, canvasColors.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        let hsv = RGBToHSV(r, g, b);

        if (isGreen(hsv)) {
            hsv.s = greenSaturation;
        } else if (isMagenta(hsv)) {
            hsv.s = magentaSaturation;
        }

        let rgb = HSVToRGB(hsv.h, hsv.s, hsv.v); 

        data[i] = rgb[0];
        data[i + 1] = rgb[1];
        data[i + 2] = rgb[2];
    }

    canvasColors.getContext("2d").putImageData(imageData, 0, 0);
}

});
