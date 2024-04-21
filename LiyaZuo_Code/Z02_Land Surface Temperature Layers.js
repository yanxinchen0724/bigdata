// Load the MODIS Land Surface Temperature dataset and select the LST_1KM band
var dataset = ee.ImageCollection('MODIS/061/MOD21A1D')
                  // .filter(ee.Filter.date('2019-01-01', '2023-12-31'));
                  // .filter(ee.Filter.date('2019-01-01', '2019-12-31'));
                  // .filter(ee.Filter.date('2020-01-01', '2020-12-31'));
                  // .filter(ee.Filter.date('2021-01-01', '2021-12-31'));
                  // .filter(ee.Filter.date('2022-01-01', '2022-12-31'));
                  .filter(ee.Filter.date('2023-01-01', '2023-12-31'));

var LST = dataset.select('LST_1KM');

// Define visualization parameters for land surface temperature
var LSTVis = {
  min: 280.0,
  max: 310.0,
  palette: [
    '040274', '040281', '0502a3', '0502b8', '0502ce', '0502e6',
    '0602ff', '235cb1', '307ef3', '269db1', '30c8e2', '32d3ef',
    '3be285', '3ff38f', '86e26f', '3ae237', 'b5e22e', 'd6e21f',
    'fff705', 'ffd611', 'ffb613', 'ff8b13', 'ff6e08', 'ff500d',
    'ff0000', 'de0101', 'c21301', 'a71001', '911003'
  ],
};

// Load the Ningxia feature collection
var ningxia = ee.FeatureCollection("projects/ee-2024bsabd/assets/ningxia");
var cities = ningxia.filter(ee.Filter.eq('Layer', 'City'));
var districts = ningxia.filter(ee.Filter.eq('Layer', 'District'));

// Compute the mean of the land surface temperature collection and clip it to the Ningxia region
var meanLST = LST.mean().clip(ningxia);
var cityAverages = meanLST.reduceRegions({
  collection: cities,
  reducer: ee.Reducer.mean(),
  scale: 500
});
var districtAverages = meanLST.reduceRegions({
  collection: districts,
  reducer: ee.Reducer.mean(),
  scale: 500
});

// Add the clipped mean land surface temperature layer to the map with visualization parameters
Map.addLayer(meanLST, LSTVis, 'Land Surface Temperature');

// Center the map over the Ningxia region
Map.centerObject(ningxia, 6);

// Calculate statistics over the region
var stats = meanLST.reduceRegion({
  reducer: ee.Reducer.minMax(),
  geometry: ningxia.geometry(),
  scale: 1000,  // Adjust the scale to an appropriate value for your analysis
  maxPixels: 1e9
});

// Use 'print' instead of 'console.log'
stats.evaluate(function(result) {
  print('Min LST:', result['LST_1KM_min']);
  print('Max LST:', result['LST_1KM_max']);
}, function(error) {
  print('Error:', error);
});

// Output the average for each city
cityAverages.evaluate(function(result) {
  if (result && result.features) {
    result.features.forEach(function(feature) {
      var props = feature.properties; // Get all properties
      var city = props.Name; // Assuming the feature has a 'Name' property as the city name
      var avgLST = props.mean; // Get the average LST value
      // Check if all required properties are present
      if (city && avgLST !== undefined) {
        print(city + ' LST: ' + avgLST);
      } else {
        print('Missing data for one or more features');
      }
    });
  } else {
    print('No results found or error in fetching data');
  }
});
districtAverages.evaluate(function(result) {
  if (result && result.features) {
    result.features.forEach(function(feature) {
      var props = feature.properties; // Get all properties
      var district = props.Name; // Assuming the feature has a 'Name' property as the district name
      var avgLST = props.mean; // Get the average LST value
      // Check if all required properties are present
      if (district && avgLST !== undefined) {
        print(district + ' LST: ' + avgLST);
      } else {
        print('Missing data for one or more features');
      }
    });
  } else {
    print('No results found or error in fetching data');
  }
});

// Export the image to GEE Assets
Export.image.toAsset({
  image: meanLST,
  // description: 'Ningxia_Mean_LST_2019',
  // description: 'Ningxia_Mean_LST_2020',
  // description: 'Ningxia_Mean_LST_2021',
  // description: 'Ningxia_Mean_LST_2022',
  description: 'Ningxia_Mean_LST_2023',
  assetId: 'users/ee-2024bsabd/assets',
  scale: 500,
  region: ningxia.geometry(),
  maxPixels: 1e13
});
