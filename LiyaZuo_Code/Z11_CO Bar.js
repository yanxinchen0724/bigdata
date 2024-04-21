// Load table data
var table = ee.FeatureCollection('projects/ee-2024bsabd/assets/COx2');

// Define a function to generate sorted horizontal bar charts
function createSortedBarChart(featureCollection, levelType, year) {
  // Select 'Area' and the given year's column
  var selectedData = featureCollection
    .filter(ee.Filter.eq('Level', levelType))
    .select(['Area', year]);

  // Sort by the column of the given year, from largest to smallest
  var sortedData = selectedData.sort(year, false);

  // Create a horizontal bar chart
  var chart = ui.Chart.feature.byFeature({
    features: sortedData,
    xProperty: 'Area',
    yProperties: [year]
  })
  .setChartType('BarChart')
  .setOptions({
    title: levelType + ' Ranking of CO Density in ' + year,
    hAxis: {title: 'CO Density (e^-2 mol/m^2)'},
    vAxis: {title: levelType, textStyle: {fontSize: 10}, showTextEvery: 1},
    bars: 'horizontal',
    chartArea: {width: '60%', height: '80%'},  // Adjust the chart area size to ensure title visibility
    series: 0,
    legend: {position: 'none'}
  });

  // Print the chart
  print(chart);
}

// Define list of years
var years = ['2019', '2020', '2021', '2022', '2023'];

// Generate horizontal bar charts for each year and level
years.forEach(function(year) {
  createSortedBarChart(table, 'City', year);
  createSortedBarChart(table, 'District', year);
});
