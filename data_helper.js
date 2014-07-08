// get rid of ANY NANs
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
  return toFromHash;
}

// make data hash of from and tos --posTimeline and negTimeline
function makeDateHash(dates){

  dates = dates.filter(function(datePair){
    return !((datePair.from < 0) || (datePair.to < 0));
  });

  return dates;
}

// make a timeline, just the date and position
function makeTimeLineOfVisits(dates){

  dates.sort(function(prev, next){ return prev - next; });
  dates.pop();
  var mapped = dates.map(function(x) {
    // var sign = x < 0 ? -1 : 1;
    return Math.pow(Math.abs(x), 0.6);
  });

  var min = mapped[0];
  var max = mapped[mapped.length-1];

  var circleValues = mapped.map(function(date, index){
    var circleValue = {};
    circleValue.date = dates[index];
    circleValue.position = getPosition(min, max, date);
    return circleValue;
  });
  return circleValues;
}

function getPosition(min, max, date){
  var range = max - min;
  var multiple = range/360;

  return ((date - min)/multiple);

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

function makeDateList(dates){
  var dateList = [];

  dates.forEach(function(datePair){
    dateList.push(datePair.to);
    dateList.push(datePair.from);
  });
  return dateList;
}
