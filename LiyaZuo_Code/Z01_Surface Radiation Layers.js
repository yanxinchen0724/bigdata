// Load the MODIS MCD18A1 dataset and select the GMT 1200 DSR
var dataset = ee.ImageCollection('MODIS/061/MCD18A1')
                  //.filterDate('2019-01-01', '2023-12-31');
                  
                  // .filterDate('2019-01-01', '2019-12-31');
                  // .filterDate('2020-01-01', '2020-12-31');
                  // .filterDate('2021-01-01', '2021-12-31');
                  // .filterDate('2022-01-01', '2022-12-31');
                  .filterDate('2023-01-01', '2023-12-31');
                  
var gmt_1200_dsr = dataset.select('GMT_1200_DSR');

// Set visualization parameters
var gmt_1200_dsr_vis = {
  min: 0.35,
  max: 4.3,
  palette: ['0f17ff', 'b11406', 'f1ff23'],
};

// Load the Ningxia Feature Collection
var ningxia = ee.FeatureCollection("projects/ee-2024bsabd/assets/ningxia");
var cities = ningxia.filter(ee.Filter.eq('Layer', 'City'));
var districts = ningxia.filter(ee.Filter.eq('Layer', 'District'));

// Calculate the average value of the dataset and clip it to the Ningxia region
var meanDSR = gmt_1200_dsr.mean().clip(ningxia);
var cityAverages = meanDSR.reduceRegions({
  collection: cities,
  reducer: ee.Reducer.mean(),
  scale: 500
});
var districtAverages = meanDSR.reduceRegions({
  collection: districts,
  reducer: ee.Reducer.mean(),
  scale: 500
});

// Add the clipped mean surface solar direct radiation layer to the map and set visualization parameters
Map.addLayer(meanDSR, gmt_1200_dsr_vis, 'Surface Radiation Daily 2023');

// Set the map center on the Ningxia region
Map.centerObject(ningxia, 6);

// Use reduceRegion to calculate the maximum and minimum values
var maxMin = meanDSR.reduceRegion({
  reducer: ee.Reducer.minMax(),
  geometry: ningxia.geometry(),
  scale: 500, // Adjust according to data resolution and geographical accuracy needs
  maxPixels: 1e9
});

// Print results to the console
maxMin.evaluate(function(result) {
  print('Min DSR of Ningxia:', result['GMT_1200_DSR_min']);
  print('Max DSR of Ningxia:', result['GMT_1200_DSR_max']);
});

// Output the average value for each city
cityAverages.evaluate(function(result) {
  if (result && result.features) {
    result.features.forEach(function(feature) {
      var props = feature.properties; // Retrieve all properties
      var city = props.Name; // Assume features have a 'Name' property as the city name
      var avgDSR = props.mean; // Get the average DSR value
      // Check if all required properties exist
      if (city && avgDSR !== undefined) {
        print(city + ' Average Daily Surface Radiation: ' + avgDSR);
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
      var district = props.Name; // Assume features have a 'Name' property as the district name
      var avgDSR = props.mean; // Get the average DSR value
      // Check if all required properties exist
      if (district && avgDSR !== undefined) {
        print(district + ' Average Daily Surface Radiation: ' + avgDSR);
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
  image: meanDSR,
  // description: 'Mean_DSR_Ningxia_2019',
  // description: 'Mean_DSR_Ningxia_2020',
  // description: 'Mean_DSR_Ningxia_2021',
  // description: 'Mean_DSR_Ningxia_2022',
  description: 'Mean_DSR_Ningxia_2023',
  assetId: 'users/ee-2024bsabd/assets',
  scale: 500,
  region: ningxia.geometry(),
  maxPixels: 1e13
});
