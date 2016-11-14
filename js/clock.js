// can be any JS based clock impl. below is adapted from an example on w3schools
// attempts to mimic the default MacOS World Clock widget
var Clock = Clock || {};
var Moment = require('moment');
require('moment-timezone');

Clock.initialize = function() { 
  Clock.draw('clock-blr', 'Asia/Kolkata');
  Clock.draw('clock-kc', 'CST6CDT');
}

Clock.draw = function(element, timezone) {
  var canvas = document.getElementById(element);
  var ctx = canvas.getContext('2d');
  var radius = canvas.height / 2 - 10;
  ctx.fillStyle = 'blue';
  ctx.fillText(timezone, 20, 190);
  ctx.translate(radius, radius);
  radius = radius * 0.90;
  setInterval(Clock.refresh, 1000, ctx, radius, timezone);
}

Clock.refresh = function(ctx, radius, timezone) {
  var now = Moment().tz(timezone);
  Clock.drawFace(ctx, radius, now);
  Clock.drawNumbers(ctx, radius);
  Clock.drawTime(ctx, radius, now);
}

Clock.drawFace = function(ctx, radius, now) {
  var hour = now.hours(), bgStyle = 'black', fgStyle = 'white';
  if (Clock.isDay(hour)) {
    bgStyle = 'white';
    fgStyle = 'black';
  }
  var grad;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2 * Math.PI);
  ctx.fillStyle = bgStyle;
  ctx.fill();
  grad = ctx.createRadialGradient(0, 0, radius * 0.95, 0, 0, radius * 1.05);
  grad.addColorStop(0, '#333');
  grad.addColorStop(0.5, 'grey');
  grad.addColorStop(1, '#333');
  ctx.strokeStyle = grad;
  ctx.lineWidth = radius * 0.1;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
  ctx.fillStyle = fgStyle;
  ctx.fill();
}

Clock.drawNumbers = function(ctx, radius) {
  var ang;
  var num;
  ctx.font = radius * 0.15 + 'px arial';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  for (num = 1; num < 13; num++) {
    ang = num * Math.PI / 6;
    ctx.rotate(ang);
    ctx.translate(0, -radius * 0.85);
    ctx.rotate(-ang);
    ctx.fillText(num.toString(), 0, 0);
    ctx.rotate(ang);
    ctx.translate(0, radius * 0.85);
    ctx.rotate(-ang);
  }
}

Clock.drawTime = function(ctx, radius, now) {
    var hour = now.hours(),
     minute = now.minutes(),
     second = now.seconds(),
     style = 'white';

    if (Clock.isDay(hour)) {
      style = 'black';
    }
    //hour
    hour = hour % 12;
    hour = (hour * Math.PI / 6) 
      + (minute * Math.PI / (6 * 60))
      + (second * Math.PI / (360 * 60));
    Clock.drawHand(ctx, hour, radius * 0.5, radius * 0.07, style);
    //minute
    minute = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60));
    Clock.drawHand(ctx, minute, radius * 0.8, radius * 0.07, style);
    // second
    second = (second * Math.PI / 30);
    Clock.drawHand(ctx, second, radius * 0.9, radius * 0.02, 'red');
}

Clock.drawHand = function(ctx, pos, length, width, style) {
    ctx.beginPath();
    ctx.strokeStyle = style;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.moveTo(0,0);
    ctx.rotate(pos);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.rotate(-pos);
}

Clock.isDay = function(hour) {
  if (hour >= 6 && hour <= 18) {
    return true;
  }
  return false;
}