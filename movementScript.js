document.addEventListener("DOMContentLoaded", function () {

    function drawTriangle() {
        var baseApex1X = parseInt(document.getElementById('baseApex1X').value);
        var baseApex1Y = parseInt(document.getElementById('baseApex1Y').value);
        var baseApex2X = parseInt(document.getElementById('baseApex2X').value);
        var baseApex2Y = parseInt(document.getElementById('baseApex2Y').value);
        var height = parseInt(document.getElementById('height').value);

        drawIsoscelesTriangle(baseApex1X, baseApex1Y, baseApex2X, baseApex2Y, height);
    }

    function drawIsoscelesTriangle(baseApex1X, baseApex1Y, baseApex2X, baseApex2Y, height) {
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('2d');

        // Clear previous drawings
        //ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the base
        ctx.beginPath();
        ctx.moveTo(baseApex1X, baseApex1Y);
        ctx.lineTo(baseApex2X, baseApex2Y);
        ctx.stroke();

        // Calculate the midpoint of the base
        var midBaseX = (baseApex1X + baseApex2X) / 2;
        var midBaseY = (baseApex1Y + baseApex2Y) / 2;

        // Calculate the direction vector of the base
        var dirX = baseApex2X - baseApex1X;
        var dirY = baseApex2Y - baseApex1Y;

        // Calculate the length of the base
        var baseLength = Math.sqrt(dirX * dirX + dirY * dirY);

        // Calculate unit vector perpendicular to the base
        var perpX = -dirY / baseLength;
        var perpY = dirX / baseLength;

        // Calculate the third apex using the height and the perpendicular direction
        var apexX = midBaseX + perpX * height;
        var apexY = midBaseY + perpY * height;

        // Draw the remaining sides
        ctx.moveTo(baseApex1X, baseApex1Y);
        ctx.lineTo(apexX, apexY);
        ctx.lineTo(baseApex2X, baseApex2Y);
        ctx.closePath();

        ctx.lineWidth = 2;
        ctx.strokeStyle = 'black';
        ctx.stroke();
    }

    function drawLine() {
        var A = parseFloat(document.getElementById('A').value);
        var B = parseFloat(document.getElementById('B').value);
        var C = parseFloat(document.getElementById('C').value);

        drawLinearEquation(A, B, C);
    }

    

    function drawLinearEquation(A, B, C) {
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('2d');

        // Clear previous drawings
        //ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();

        if (B !== 0) {
            // Draw line for non-vertical case
            var startX = 0;
            var startY = (-C - A * startX) / B;
            var endX = canvas.width;
            var endY = (-C - A * endX) / B;

            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
        } else {
            // Draw line for vertical case (B = 0)
            var x = -C / A;
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
        }

        ctx.lineWidth = 2;
        ctx.strokeStyle = 'black';
        ctx.stroke();

        

    }
    function mirrorTriangleWithMatrix(A, B, C) {
        var normLine = normalizeLine(A, B, C);
        A = normLine.A;
        B = normLine.B;
        C = normLine.C;

        var matrix = [
            [1 - 2 * A * A, -2 * A * B, -2 * A * C],
            [-2 * A * B, 1 - 2 * B * B, -2 * B * C],
            [0, 0, 1]
        ];

        var baseApex1 = transformPoint(parseInt(document.getElementById('baseApex1X').value), parseInt(document.getElementById('baseApex1Y').value), matrix);
        var baseApex2 = transformPoint(parseInt(document.getElementById('baseApex2X').value), parseInt(document.getElementById('baseApex2Y').value), matrix);
        var heightApex = transformPoint((parseInt(document.getElementById('baseApex1X').value) + parseInt(document.getElementById('baseApex2X').value)) / 2, (parseInt(document.getElementById('baseApex1Y').value) + parseInt(document.getElementById('baseApex2Y').value)) / 2 - parseInt(document.getElementById('height').value), matrix);

        drawIsoscelesTriangle(baseApex1.x, baseApex1.y, baseApex2.x, baseApex2.y, heightApex.y);
    }

    function transformPoint(x, y, matrix) {
        var newX = matrix[0][0] * x + matrix[0][1] * y + matrix[0][2];
        var newY = matrix[1][0] * x + matrix[1][1] * y + matrix[1][2];
        return { x: newX, y: newY };
    }

    function normalizeLine(A, B, C) {
        var norm = Math.sqrt(A * A + B * B);
        return { A: A / norm, B: B / norm, C: C / norm };
    }


});