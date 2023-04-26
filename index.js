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

$.getJSON(url, function (rawData) {
  const description = rawData['description'];
  const data = rawData['data'];
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
  Object.values(data).forEach((value, index) => {
    if (index < 10) {
      ctx.save();
      ctx.translate(canvasWidth / 2, canvasHeight / 2);
      var angle = (index * Math.PI) / 6;
      ctx.rotate(angle);

      ctx.restore();
    }
  });

  // Test
  /*ctx.beginPath();
  ctx.moveTo(centerRadius, 300);
  ctx.lineTo(300, 400);
  ctx.stroke();
  ctx.lineTo(220, 350);
  ctx.stroke();*/
});

// Color backgrounds
$('#title').css('background-color', 'dimgray');
//$('#graph').css('background-color', '#DDDDFF');

$('body').ready().css('background-color', 'darkslategray');
