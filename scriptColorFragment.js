document.addEventListener("DOMContentLoaded", function () {
    
    let selectedRegion = { x: 0, y: 0, width: 0, height: 0 };
    let isSelecting = false;
    
    document.getElementById('imageInput').addEventListener('change', function(e) {
        let canvas = document.getElementById('imageCanvas');
        let ctx = canvas.getContext('2d');
        let reader = new FileReader();
        let img = new Image();
    
        reader.onload = function(event) {
            let img = new Image();
            img.onload = function() {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                initRegionSelection(canvas, ctx, img);
            }
            img.src = event.target.result;
        }
        reader.readAsDataURL(e.target.files[0]);
    });
    
    function initRegionSelection(canvas, ctx, img) {
        canvas.onmousedown = function(e) {
            isSelecting = true;
            selectedRegion.x = e.offsetX;
            selectedRegion.y = e.offsetY;
            selectedRegion.width = 0; // Reset the width
            selectedRegion.height = 0; // Reset the height
        }
    
        canvas.onmousemove = function(e) {
            if (!isSelecting) return;
            selectedRegion.width = e.offsetX - selectedRegion.x;
            selectedRegion.height = e.offsetY - selectedRegion.y;
            drawRegion(ctx, canvas, img); // Pass the image to drawRegion
        }
    
        canvas.onmouseup = function(e) {
            isSelecting = false;
            drawRegion(ctx, canvas, img); // Draw one last time to fix the rectangle if needed
        }
    }
    
    function drawRegion(ctx, canvas, img) {
        // Clear the canvas before redrawing everything
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Redraw the image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Draw the selection rectangle if we are in selection mode
        if (isSelecting) {
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2; // Set the line width if needed
            ctx.setLineDash([6]); // Optional: create a dashed line for the rectangle
            ctx.strokeRect(selectedRegion.x, selectedRegion.y, selectedRegion.width, selectedRegion.height);
        }
    }
          
    function changeColor() {
        let hueChange = parseInt(document.getElementById('hue').value);
        let saturationChange = parseInt(document.getElementById('saturation').value) / 100;
        let valueChange = parseInt(document.getElementById('value').value) / 100;
    
    
        let canvas = document.getElementById('imageCanvas');
        let ctx = canvas.getContext('2d');
        let imageData = ctx.getImageData(selectedRegion.x, selectedRegion.y, selectedRegion.width, selectedRegion.height);
        let data = imageData.data;
    
    
        for (let i = 0; i < data.length; i += 4) {
            let r = data[i];
            let g = data[i + 1];
            let b = data[i + 2];
        
            let hsv = RGBToHSV(r, g, b);
            hsv.h += hueChange / 360;
            if (hsv.h > 1) hsv.h -= 1;
            hsv.s *= saturationChange;
            hsv.v *= valueChange;
        
            let rgb = HSVToRGB(hsv.h, hsv.s, hsv.v);
            data[i] = rgb[0];
            data[i + 1] = rgb[1];
            data[i + 2] = rgb[2];
        }
      
        ctx.putImageData(imageData, selectedRegion.x, selectedRegion.y);
    }
    
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
    
               
    
});
    