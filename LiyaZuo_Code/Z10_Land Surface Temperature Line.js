// Load table data
var table = ee.FeatureCollection('projects/ee-2024bsabd/assets/LSTx1');

// Filter out rows where the 'Area' column value is 'Max' or 'Min'
var filteredTable = table.filter(ee.Filter.and(
  ee.Filter.neq('Area', 'Max'),
  ee.Filter.neq('Area', 'Min')
));

// Select features where the 'Level' column value is 'City' and 'District'
var cities = filteredTable.filter(ee.Filter.eq('Level', 'City'));
var districts = filteredTable.filter(ee.Filter.eq('Level', 'District'));

// Define a function to create and print charts
function createAndPrintChart(featureCollection, titlePrefix) {
  // Convert the FeatureCollection to a List
  var featureList = featureCollection.toList(featureCollection.size());
  
  featureList.evaluate(function(list) {
    // Iterate over each Feature in the List
    list.forEach(function(f) {
      var feature = ee.Feature(f);
      
      // Asynchronously retrieve the 'Area' and 'Level' column values
      ee.Dictionary({
        area: feature.get('Area'),
        level: feature.get('Level')
      }).evaluate(function(names) {
        // Extract data for required years
        var data2019 = feature.get('2019');
        var data2020 = feature.get('2020');
        var data2021 = feature.get('2021');
        var data2022 = feature.get('2022');
        var data2023 = feature.get('2023');
        
        // Create an array containing all years and corresponding data
        var yearData = [
          {year: '2019', value: data2019},
          {year: '2020', value: data2020},
          {year: '2021', value: data2021},
          {year: '2022', value: data2022},
          {year: '2023', value: data2023}
        ];
        
        // Use ee.Array object to create a chart
        var chart = ui.Chart.array.values(ee.Array(yearData.map(function(item){
          return ee.Feature(null, item).get('value');
        })), 0, yearData.map(function(item) { return item.year; }))
            .setChartType('LineChart')
            .setOptions({
              title: titlePrefix + names.area + ', ' + names.level,
              hAxis: {title: 'Year'},
              vAxis: {title: 'Land Surface Temperature (K)'},
              lineWidth: 1,
              pointSize: 3,
              legend: {position: 'none'} // Do not display legend
            });
        
        // Print the chart
        print(chart);
      });
    });
  });
}

// Use the defined function to create charts for 'City' and 'District' levels
createAndPrintChart(cities, 'Land Surface Temperature of ');
createAndPrintChart(districts, 'Land Surface Temperature of ');
