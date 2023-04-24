// Import stylesheets
import './style.css';

let url =
  'https://www.ncei.noaa.gov/access/monitoring/climate-at-a-glance/global/time-series/globe/ocean/all/1/1900-2023/data.json';

$.getJSON(url, function (data) {
  console.log(data);
});

$('#title').css('background-color', '#08FFFF').text('Title');
