// JOURNEYYYYYYYY

function Journey(dates, min, max){

  this.from = dates.from;
  this.to = dates.to;
  this.angles = {};
  this.angles.from = degreesToRadians(getPosition(Math.pow(Math.abs(min), 0.6),Math.pow(Math.abs(max), 0.6), Math.pow(dates.from, 0.6)));
  debugger;
  this.angles.to = degreesToRadians(getPosition(Math.pow(Math.abs(min), 0.6), Math.pow(Math.abs(max), 0.6), Math.pow(dates.to, 0.6)));

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
      this.still = true;
    }
  }
};

Journey.prototype.draw = function(context, colour) {
  if(this.still){ return; }

  context.beginPath();
  context.moveTo(this.positions.from.point.x, this.positions.from.point.y);
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

  // context.lineTo(this.positions.to.point.x, this.positions.to.point.y);
  console.log('from: ' + this.positions.from.point.x + ' ' + this.positions.from.point.y + ' to: ' + this.positions.to.point.x + ' ' + this.positions.to.point.y);
  context.closePath();
  context.stroke();
};
