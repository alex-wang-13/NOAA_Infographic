// Import stylesheets
import './style.css';

const canvas = $('#graph');
const canvasHeight = canvas.height();
const canvasWidth = canvas.width();
const innerRadius =
  canvasHeight < canvasWidth ? canvasHeight / 8 : canvasWidth / 8;
const centerRadius = innerRadius * 2;
const outerRadius = innerRadius * 3;
const warmColor = '#FA0000';
//const coolColor = '#66C6CC';
const coolColor = '#0000FF';

// Performs a linear interpolation
function lerp(a, b, t) {
  return a + (b - a) * t;
}

// Performs lerp between two color values
function interpolateColor(color1, color2, value) {
  // Convert hex colors to RGB
  const r1 = parseInt(color1.substring(1, 3), 16);
  const g1 = parseInt(color1.substring(3, 5), 16);
  const b1 = parseInt(color1.substring(5, 7), 16);
  const r2 = parseInt(color2.substring(1, 3), 16);
  const g2 = parseInt(color2.substring(3, 5), 16);
  const b2 = parseInt(color2.substring(5, 7), 16);

  // Interpolate RGB values
  const r = Math.round(r1 + (r2 - r1) * value);
  const g = Math.round(g1 + (g2 - g1) * value);
  const b = Math.round(b1 + (b2 - b1) * value);

  // Convert back to hex
  const hex = '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
  return hex;
}

// Calculates the interpolated value given an upper and lower bound
function getInterpolationValue(lowerBound, upperBound, value) {
  const range = upperBound - lowerBound;
  const adjustedValue = value - lowerBound;
  const interpolationValue = adjustedValue / range;
  return interpolationValue;
}

let url =
  'https://www.ncei.noaa.gov/access/monitoring/climate-at-a-glance/global/time-series/globe/ocean/all/1/1900-2023/data.json';

$.getJSON(url, function (rawData) {
  const description = rawData['description'];
  const data = rawData['data'];

  // Color hmtl elements
  $('#title')
    .css('background-color', 'lightgray')
    .css('font-size', '24px')
    .text(description['title']);
  $('body').ready().css('background-color', 'black');

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
  ctx.fillText('0℃', centerRadius + offset, 0);
  ctx.fillText('1℃', outerRadius + offset, 0);
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
      // Save year for later
      var year = Object.keys(data)[index].slice(0, 4);

      ctx.save();
      // Update the center of the graph to the center of the circles
      ctx.translate(canvasWidth / 2, canvasHeight / 2);
      // Initialize the graph in the case of the first point
      if (index == 0) {
        // Use linear interpolation to calculate distance from center
        ctx.beginPath();
        ctx.moveTo(0, -lerp(centerRadius, outerRadius, value));
      } else {
        // Reduce the index to a value 0 to 12 (simplifying math)
        index = index % 12;
        // Find the angle of the new point
        var angle = ((index - 3) * Math.PI) / 6;
        // Find the radius to plot
        var radius = lerp(centerRadius, outerRadius, value);
        // Find the corresponding x and y values
        var x = radius * Math.cos(angle);
        var y = radius * Math.sin(angle);

        // Create a line to x, y
        ctx.lineTo(x, y);
        ctx.lineWidth = 1;
        var style = interpolateColor(
          coolColor,
          warmColor,
          getInterpolationValue(innerRadius, outerRadius, radius)
        );
        ctx.strokeStyle = style;
        ctx.stroke();

        // Handle year in center of chart
        if (index == 0) {
          // Clear previous year
          ctx.clearRect(-50, -35, 100, 70);
          // Update year in center of chart
          ctx.font = '36px arial';
          ctx.fillStyle = interpolateColor(style, '#FFFFFF', 0.25);
          ctx.fillText(year, 0, 0);
        }

        // Move start position to x, y
        ctx.beginPath();
        ctx.moveTo(x, y);
      }
      ctx.restore();
    }, index * 10); // Set a pause between each stroke of the animation
  });
});
