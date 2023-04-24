// Import stylesheets
import './style.css';

const canvas = $('#graph');
const canvasHeight = canvas.height();
const canvasWidth = canvas.width();
const innerRadius =
  canvasHeight < canvasWidth ? canvasHeight / 8 : canvasWidth / 8;
const centerRadius = innerRadius * 2;
const outerRadius = innerRadius * 3;

let url =
  'https://www.ncei.noaa.gov/access/monitoring/climate-at-a-glance/global/time-series/globe/ocean/all/1/1900-2023/data.json';

$.getJSON(url, function (data) {
  console.log(data);
  // Get the canvas
  var canvas = $('#graph')[0];
  var ctx = canvas.getContext('2d');

  // Draw inner radius
  ctx.arc(canvasHeight / 2, canvasWidth / 2, innerRadius, 0, 2 * Math.PI, true);
  ctx.stroke();

  // Draw center radius
  ctx.beginPath();
  ctx.arc(
    canvasHeight / 2,
    canvasWidth / 2,
    centerRadius,
    0,
    2 * Math.PI,
    true
  );
  ctx.stroke();

  // Draw outer radius
  ctx.beginPath();
  ctx.arc(canvasHeight / 2, canvasWidth / 2, outerRadius, 0, 2 * Math.PI, true);
  ctx.stroke();
});

// Color backgrounds
$('#title').css('background-color', '#08FFFF');
$('#graph').css('background-color', '#DDDDDDDD');
