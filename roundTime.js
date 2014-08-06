// setup some variables
var canvas = document.getElementById('time');
var context = canvas.getContext("2d");
var radius = 250;
var centerX = canvas.width/2;
var centerY = canvas.height/2;

// GET DATA FROM MY FILE
var xhr = getData('http://localhost:8080/DoctorWhoTimeTravelJourneys.json');
// xhr.onload = parseData;
// same thing -- when it is loaded parse the data -- see data_parser_helper
xhr.addEventListener('load', function(){
  var parsedData = parseData(xhr.responseText); //no more NANs -- still in order of his travel
  var positiveDates = makeDateHash(parsedData); // just the tonfrom dates -- still in order of his travel
  var listedDates = makeDateList(positiveDates);
  var sortedDates = makeTimeLineOfVisits(listedDates); // points of travel in order of time
  var equalTickTimeline = makeEqualSpacedTimeline(listedDates); // equal spaced ticks of time
  startCircle(equalTickTimeline, positiveDates, sortedDates); // draw!
});

function getData(url){
  xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
  return xmlhttp;
}


function startCircle(timeLine, journey, datePoints){
  var tickLength = 5;

  context.beginPath();
  context.arc(centerX, centerY, radius, 0, Math.PI*2, true);
  context.closePath();
  context.lineWidth = 4;
  context.stroke();

  drawTicks(timeLine, tickLength+25, '#212321');
  drawTicks(datePoints, tickLength + 20, '#747a74');

  var colour = '#4a78e5';
  var min = datePoints[0].date;
  var max = datePoints[datePoints.length - 1].date;

  journeyLines = journey.map(function(dates, index){
    var journeyLine = new Journey(dates, min, max);

    journeyLine.draw(context, colour);
    colour = incrementColour(colour, 150);
    return journeyLine;
  });

  // console.table(journeyLines, ["from", "to", "anglefrom", "angleto"]);
}
var div = document.createElement('div');
document.body.appendChild(div);
canvas.addEventListener('mousemove', function (event) {
  div.innerHTML = "X " +  event.pageX + " Y " + event.pageY
});
