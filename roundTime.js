var xhr = getData('dorothyjw.github.io/drwho/DoctorWhoTimeTravelJourneys.json');
// xhr.onload = parseData;
// same thing
xhr.addEventListener('load', function(){
  parseData(xhr.responseText);
});

var canvas = document.getElementById('time');
var context = canvas.getContext("2d");
var radius = 250;
var centerX = canvas.width/2;
var centerY = canvas.height/2;

function getData(url){
  xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
  return xmlhttp;
}

//
function parseData(responseText){
  var data = JSON.parse(responseText);
  var toFromHash = data.map(function(datum, index){
    var newDatum = {};
    newDatum.from = parseInt(datum['from '], 10);
    newDatum.to = parseInt(datum['to'], 10);

    return newDatum;
  }).filter(function(datum){
    if(isNaN(datum.from) || isNaN(datum.to)){
      return false;
    }
    return true;
  });

  var datesInOrder = makeDateHash(toFromHash); // just the dates
  var datePoints = makeTimeLine(datesInOrder.posTimeline); // points of travel in order of his travelling

  window.getPositionFromDate = function(date){
    var position;
    datePoints.forEach(function(point){
      if(point.date == date){
        position = point.position;
        console.log('FOUND');
      }
      console.log('date :' + date);
    });
    return position;
  }
  var equalTickTimeline = makeEqualSpacedTimeline(datesInOrder.posTimeline); // equal spaced ticks of time
  startCircle(equalTickTimeline, toFromHash, datePoints); // draw!
}


// get da data

// make data hash of from and tos
function makeDateHash(dates){
  var posTimeline = [];
  var negTimeline = [];

  dates.forEach(function(pair, index){

    if(pair.from > 0){
      if(!isNaN(pair.from) && posTimeline.indexOf(pair.from)  == -1){
        posTimeline.push(pair.from);
      }
    }
    if(pair.to > 0){
      if(!isNaN(pair.to) && posTimeline.indexOf(pair.to)  == -1){
        posTimeline.push(pair.to);
      }
    }
    if(pair.from < 0){
      if(!isNaN(pair.from) && negTimeline.indexOf(pair.from) == -1){
        negTimeline.push(pair.from);
      }
    }
    if(pair.to < 0){
      if(!isNaN(pair.to) && negTimeline.indexOf(pair.to) == -1){
        negTimeline.push(pair.to);
      }
    }
  });
  return { 'negTimeline': negTimeline, 'posTimeline':posTimeline };
}

// make a timeline, just the date and position
function makeTimeLine(posTimeline){


  posTimeline.sort(function(prev, next){ return prev - next; });
  posTimeline.pop();
  var mapped = posTimeline.map(function(x) {
    // var sign = x < 0 ? -1 : 1;
    return Math.pow(Math.abs(x), 0.6);
  });
  var min = mapped[0];
  var max = mapped[mapped.length-1];
  var range = max - min;
  var multiple = range/360;

  var circleValues = mapped.map(function(date, index){
    var circleValue = {};
    circleValue.date = posTimeline[index];
    circleValue.position = ((date - min)/multiple);
    return circleValue;
  });
  return circleValues;
}

function makeEqualSpacedTimeline(dates){

  dates.sort(function(prev, next){ return prev - next; });
  dates.pop();

  var mapped = dates.map(function(x) {
    return Math.pow(Math.abs(x), 0.6);
  });

  var min = mapped[0];
  var max = mapped[mapped.length - 1];
  var range = max - min;
  var steps = 36;
  var increment = 360/steps;
  var oneStep = (range/steps);

  var ticks = [];
  for(var i = 0; i < steps; i ++){
    var tick = {};
    tick.position = i*increment;
    tick.date = Math.round(Math.pow(((oneStep * i) + min), 1/0.6));
    ticks.push(tick);
  }
  return ticks;
}


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

function Journey(dates){
  this.from = dates.from;
  this.to = dates.to;
  this.angles = {};
  this.angles.from = degreesToRadians(getPositionFromDate(dates.from));
  this.angles.to = degreesToRadians(getPositionFromDate(dates.to));
  console.log(dates);

  this.positions = {
    from: {
      point: getLocationOnCircle(centerX, centerY, radius, this.angles.from),
      bezier: getLocationOnCircle(centerX, centerY, (radius - 100), this.angles.from)
    },
    to: {
      point: getLocationOnCircle(centerX, centerY, radius, this.angles.to),
      bezier: getLocationOnCircle(centerX, centerY, (radius - 100), this.angles.to)
    }
  };
  if(this.positions.from.point.x === this.positions.to.point.x){
    if(this.positions.from.point.y === this.positions.to.point.y){
      console.log("IM STTAYING");
      this.still = true;
    }
  }
}

Journey.prototype.draw = function(context, colour) {
  if( this.still ){ return; }

  context.moveTo(this.positions.from.point.x, this.positions.from.point.y);
  context.beginPath();
  context.strokeStyle = colour;
  context.lineWidth = 2;
  context.bezierCurveTo(
    this.positions.from.bezier.x,
    this.positions.from.bezier.y,
    this.positions.to.bezier.x,
    this.positions.to.bezier.y,
    this.positions.to.point.x,
    this.positions.to.point.y
  )
  context.stroke();
}

function startCircle(timeLine, journey, datePoints){
  var tickLength = 5;

  context.beginPath();
  context.arc(centerX, centerY, radius, 0, Math.PI*2, true);
  context.closePath();
  context.lineWidth = 4;
  context.stroke();

  drawTicks(timeLine, tickLength+25, '#212321');
  drawTicks(datePoints, tickLength, '#747a74');

  var colour = '#4a78e5';

  journey.forEach(function(dates, index){
    var journeyLine = new Journey(dates);
    if( index < 5){
      journeyLine.draw(context, colour);
      colour = incrementColour(colour, 150);
      // var prevPoint;
    }
    // var prevToRadians;
    // var prevToPoint;

    // if(index !== 0){
    //   prevPoint = journey[index-1];
    //   prevToRadians = degreesToRadians(prevPoint.to);
    //   prevToPoint = getLocationOnCircle(centerX, centerY, radius, prevToRadians);
    // }
    // if(index !== 0){
    //   // previous from to this to
    //   if( prevToRadians !== fromRadians ){
    //     context.bezierCurveTo(prevToPoint.xValue, prevToPoint.yValue, fromBezier.xValue, fromBezier.yValue, fromPoint.xValue, fromPoint.yValue);
    //     context.stroke();
    //   }
    // }
    // this to to from
    // context.moveTo(fromPoint.xValue, fromPoint.yValue);
    // if( fromRadians !== toRadians){
    //   context.bezierCurveTo(fromBezier.xValue, fromBezier.yValue, toBezier.xValue, toBezier.yValue, toPoint.xValue, toPoint.yValue);
    //   context.stroke();
    // }

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
