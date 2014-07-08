function degreesToRadians(degrees){
  return (degrees * (Math.PI/180));
}

function getLocationOnCircle(centerX, centerY, magnitude, radians){
  var point = {};
  point.x = centerX + (magnitude * Math.sin(radians));
  point.y = centerY - (magnitude * Math.cos(radians));
  return point;
}


function drawTicks(data, tickLength, tickColour){
  data.forEach(function(point, index){
    var angleInRadians = degreesToRadians(point.position);
    var tickStartPoint = getLocationOnCircle(centerX, centerY, radius, angleInRadians);
    var tickEndPoint = getLocationOnCircle(centerX, centerY, (radius + tickLength), angleInRadians);

    context.beginPath();
      // tick

      context.moveTo(tickStartPoint.xValue, tickStartPoint.yValue);
      context.strokeStyle = tickColour;
      context.lineTo(tickEndPoint.xValue, tickEndPoint.yValue);
      context.closePath();
      context.stroke();

      context.save();

      // tick dates
      context.translate(centerX, centerY);
      context.rotate(angleInRadians);
      context.rotate(-Math.PI/2);
      context.textBaseline = 'middle';
      context.strokeStyle = tickColour;
      context.fillText(point.date, radius + tickLength + 10, 0);
      context.restore();
  });

}

// temporary colour changer from https://stackoverflow.com/questions/12934720/how-to-increment-decrement-hex-color-values-with-javascript-jquery
function incrementColour(color, step) {
    var colorToInt = parseInt(color.substr(1), 16),                     // Convert HEX color to integer
        nstep = parseInt(step);                                         // Convert step to integer
    if(!isNaN(colorToInt) && !isNaN(nstep)){                            // Make sure that color has been converted to integer
        colorToInt += nstep;                                            // Increment integer with step
        var ncolor = colorToInt.toString(16);                           // Convert back integer to HEX
        ncolor = '#' + (new Array(7-ncolor.length).join(0)) + ncolor;   // Left pad "0" to make HEX look like a color
        if(/^#[0-9a-f]{6}$/i.test(ncolor)){                             // Make sure that HEX is a valid color
            return ncolor;
        }
    }
    return color;
};
