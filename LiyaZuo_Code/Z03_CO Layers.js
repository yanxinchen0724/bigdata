// Load the Sentinel-5P CO dataset and select the CO column number density
var collection = ee.ImageCollection('COPERNICUS/S5P/OFFL/L3_CO')
                      .select('CO_column_number_density')
                      .filterDate('2019-01-01', '2023-12-31');
                      // .filterDate('2019-01-01', '2019-12-31');
                      // .filterDate('2020-01-01', '2020-12-31');
                      // .filterDate('2021-01-01', '2021-12-31');
                      // .filterDate('2022-01-01', '2022-12-31');
                      // .filterDate('2023-01-01', '2023-12-31');

// Define visualization parameters for CO column number density
var band_viz = {
  min: 0.022,
  max: 0.053,
  palette: ['black', 'blue', 'purple', 'cyan', 'green', 'yellow', 'red']
};

// Load the Ningxia feature collection
var ningxia = ee.FeatureCollection("projects/ee-2024bsabd/assets/ningxia");
var cities = ningxia.filter(ee.Filter.eq('Layer', 'City'));
var districts = ningxia.filter(ee.Filter.eq('Layer', 'District'));

// Compute the mean of the CO collection and clip it to the Ningxia region
var meanCO = collection.mean().clip(ningxia);

// Add the clipped mean CO layer to the map with visualization parameters
Map.addLayer(meanCO, band_viz, 'CO Column Number Density');

// Center the map on Ningxia
Map.centerObject(ningxia, 6); 

// Compute the mean CO for cities and districts in Ningxia
var cityAverages = meanCO.reduceRegions({
  collection: cities,
  reducer: ee.Reducer.mean(),
  scale: 500
});
var districtAverages = meanCO.reduceRegions({
  collection: districts,
  reducer: ee.Reducer.mean(),
  scale: 500
});

// Use reduceRegion to calculate the maximum and minimum values
var stats = meanCO.reduceRegion({
  reducer: ee.Reducer.minMax(),
  geometry: ningxia.geometry(),
  scale: 500, // Adjust scale based on data resolution and geographical accuracy needs
  maxPixels: 1e9
});

// Use print instead of console.log
stats.evaluate(function(result) {
  print('Min CO:', result['CO_column_number_density_min']);
  print('Max CO:', result['CO_column_number_density_max']);
}, function(error) {
  print('Error:', error);
});

// Output the average value for each city
cityAverages.evaluate(function(result) {
  if (result && result.features) {
    result.features.forEach(function(feature) {
      var props = feature.properties; // Retrieve all properties
      var city = props.Name; // Assuming features have a 'Name' property as the city name
      var avgCO = props.mean; // Retrieve the average CO value
      // Check if all required properties are present
      if (city && avgCO !== undefined) {
        print(city + ' CO: ' + avgCO);
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
      var avgCO = props.mean; // Retrieve the average CO value
      // Check if all required properties are present
      if (district && avgCO !== undefined) {
        print(district + ' CO: ' + avgCO);
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
  image: meanCO,
  // description: 'Ningxia_Mean_CO_2019',
  // description: 'Ningxia_Mean_CO_2020',
  // description: 'Ningxia_Mean_CO_2021',
  // description: 'Ningxia_Mean_CO_2022',
  description: 'Ningxia_Mean_CO_2023',
  assetId: 'users/ee-2024bsabd/assets',
  scale: 500,
  region: ningxia.geometry(),
  maxPixels: 1e13
});
