// Import stylesheets
import './style.css';

const canvas = $('#graph');
const canvasHeight = canvas.height();
const canvasWidth = canvas.width();
const innerRadius =
  canvasHeight < canvasWidth ? canvasHeight / 8 : canvasWidth / 8;
const centerRadius = innerRadius * 2;
const outerRadius = innerRadius * 3;
const warmColor = '#FF0000';
const coolColer = '#0000FF';

// Performs a linear interpolation
function lerp(a, b, t) {
  return a + (b - a) * t;
}

// Performs lerp between two color values
function lerpColor(a, b, t) {
  // Convert the color values to integers
  const r1 = parseInt(a.substring(1, 3), 16);
  const g1 = parseInt(a.substring(3, 5), 16);
  const b1 = parseInt(a.substring(5, 7), 16);
  const r2 = parseInt(b.substring(1, 3), 16);
  const g2 = parseInt(b.substring(3, 5), 16);
  const b2 = parseInt(b.substring(5, 7), 16);

  // Interpolate each color channel separately
  const red = Math.round(lerp(r1, r2, t));
  const green = Math.round(lerp(g1, g2, t));
  const blue = Math.round(lerp(b1, b2, t));

  // Convert the interpolated color back to hex format
  return (
    '#' +
    red.toString(16).padStart(2, '0') +
    green.toString(16).padStart(2, '0') +
    blue.toString(16).padStart(2, '0')
  );
}

let url =
  'https://www.ncei.noaa.gov/access/monitoring/climate-at-a-glance/global/time-series/globe/ocean/all/1/1900-2023/data.json';

$.getJSON(url, function (rawData) {
  const description = rawData['description'];
  const data = rawData['data'];
  console.log(data);

  // Get the canvas
  var canvas = $('#graph')[0];
  var ctx = canvas.getContext('2d');

  // Initialize colors
  ctx.strokeStyle = 'white';
  ctx.fillStyle = 'white';

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

  // Add y-labels
  ctx.save();
  ctx.font = outerRadius * 0.05 + 'px arial';
  ctx.translate(canvasWidth / 2, canvasHeight / 2);
  const offset = innerRadius * 0.1;
  ctx.fillText('-1℃', innerRadius + offset, 0);
  ctx.fillText('-1℃', centerRadius + offset, 0);
  ctx.fillText('-1℃', outerRadius + offset, 0);
  ctx.restore();

  // Making month labels
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  months.forEach((month, index) => {
    // Save the original position of the Canvas
    ctx.save();
    ctx.font = outerRadius * 0.1 + 'px arial';
    // Center Canvas
    ctx.translate(canvasWidth / 2, canvasHeight / 2);
    // Rotate and fill text
    var angle = (index * Math.PI) / 6;
    ctx.rotate(angle);
    ctx.fillText(month, 0, -outerRadius * 1.2);
    // Restore the saved state of the Canvas
    ctx.restore();
  });

  // Iterate through the values in the data
  Object.values(data).forEach(function (value, index) {
    setTimeout(function () {
      ctx.save();
      // Update the center of the graph to the center of the circles
      ctx.translate(canvasWidth / 2, canvasHeight / 2);
      // Find the angle of the new point
      var angle = (index * Math.PI) / 6;
      ctx.rotate(angle);
      // Initialize the graph in the case of the first point
      if (index == 0) {
        // Use linear interpolation to calculate distance from center
        ctx.beginPath();
        ctx.moveTo(0, -lerp(centerRadius, outerRadius, value));
      } else {
        // Use linear interpolation to calculate distance from center
        ctx.lineTo(0, -lerp(centerRadius, outerRadius, value));
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.restore();
    }, index * 100); // Set a pause between each stroke of the animation
  });
});

// Color backgrounds
$('#title').css('background-color', 'dimgray');
//$('#graph').css('background-color', '#DDDDFF');

$('body').ready().css('background-color', 'darkslategray');
