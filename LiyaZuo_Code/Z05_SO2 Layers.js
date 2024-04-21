// Load the Sentinel-5P SO2 dataset and select the SO2 column number density
var collection = ee.ImageCollection('COPERNICUS/S5P/OFFL/L3_SO2')
  .select('SO2_column_number_density')
  .filterDate('2019-01-01', '2023-12-31');
  // .filterDate('2019-01-01', '2019-12-31');
  // .filterDate('2020-01-01', '2020-12-31');
  // .filterDate('2021-01-01', '2021-12-31');
  // .filterDate('2022-01-01', '2022-12-31');
  // .filterDate('2023-01-01', '2023-12-31');

// Define visualization parameters for SO2 column number density
var band_viz = { 
  min: -0.00004,
  max: 0.00062,
  palette: ['black', 'blue', 'purple', 'cyan', 'green', 'yellow', 'red']
};

// Load the Ningxia feature collection
var ningxia = ee.FeatureCollection("projects/ee-2024bsabd/assets/ningxia");

// Compute the mean of the SO2 collection and clip it to the Ningxia region
var meanSO2 = collection.mean().clip(ningxia);
var cities = ningxia.filter(ee.Filter.eq('Layer', 'City'));
var districts = ningxia.filter(ee.Filter.eq('Layer', 'District'));

// Add the clipped mean SO2 layer to the map with visualization parameters
Map.addLayer(meanSO2, band_viz, 'S5P SO2');

// Center the map over the Ningxia region
Map.centerObject(ningxia, 6);

// Compute the mean of the land surface temperature collection and clip it to the Ningxia region
var cityAverages = meanSO2.reduceRegions({
  collection: cities,
  reducer: ee.Reducer.mean(),
  scale: 500
});
var districtAverages = meanSO2.reduceRegions({
  collection: districts,
  reducer: ee.Reducer.mean(),
  scale: 500
});

// Use reduceRegion to calculate maximum and minimum values
var stats = meanSO2.reduceRegion({
  reducer: ee.Reducer.minMax(),
  geometry: ningxia.geometry(),
  scale: 500, // Adjust scale based on data resolution and geographical precision requirements
  maxPixels: 1e9
});

// Use print instead of console.log
stats.evaluate(function(result) {
  print('Min SO2:', result['SO2_column_number_density_min']);
  print('Max SO2:', result['SO2_column_number_density_max']);
}, function(error) {
  print('Error:', error);
});

// Output the average value for each city
cityAverages.evaluate(function(result) {
  if (result && result.features) {
    result.features.forEach(function(feature) {
      var props = feature.properties; // Retrieve all properties
      var city = props.Name; // Assuming features have a 'Name' property as the city name
      var avgSO2 = props.mean; // Retrieve the average SO2 value
      // Check if all required properties are present
      if (city && avgSO2 !== undefined) {
        print(city + ' SO2: ' + avgSO2);
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
      var props = feature.properties; // Retrieve all properties
      var district = props.Name; // Assuming features have a 'Name' property as the city name
      var avgSO2 = props.mean; // Retrieve the average SO2 value
      // Check if all required properties are present
      if (district && avgSO2 !== undefined) {
        print(district + ' SO2: ' + avgSO2);
      } else {
        print('Missing data for one or more features');
      }
    });
  } else {
    print('No results found or error in fetching data');
  }
});

// Export image to GEE Assets
Export.image.toAsset({
  image: meanSO2,
  // description: 'Ningxia_Mean_SO2_2019',
  // description: 'Ningxia_Mean_SO2_2020',
  // description: 'Ningxia_Mean_SO2_2021',
  // description: 'Ningxia_Mean_SO2_2022',
  description: 'Ningxia_Mean_SO2_2023',
  assetId: 'users/ee-2024bsabd/assets',
  scale: 500,
  region: ningxia.geometry(),
  maxPixels: 1e13
});
