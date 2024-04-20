//---Pre_processing-----
Map.addLayer(importedAsset1, {color: 'red'}, 'Imported Data1');
  

// Set the map center to a location in Ningxia
Map.setCenter(106.253352, 38.461084, 9); 


// Define the start and end dates
var start = '2022-04-01';
var end = '2022-07-01';
// Specify the bands of interest
var bands = ['B2', 'B3', 'B4','B5','B6','B7','B8', 'B8A','B11','B12'];

// Load Sentinel-2 ImageCollection, filter by date and cloud percentage, and take the mean
var sentinel = ee.ImageCollection('COPERNICUS/S2_SR')
                  .filterBounds(AOI)
                  .filter(ee.Filter.date(start, end))
                  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 1))
                  .mean()
                  .select(bands);
                  

// RGB visualization parameters
var s_rgb = {
  min: 0.0,
  max: 5000,
  bands: ['B4', 'B3', 'B2'],
  opacity: 1
};

// Calculate NDVI and select new band name
var ndvi = sentinel.normalizedDifference(['B8', 'B4']).select(['nd'], ['ndvi']).clip(AOI);

// Calculate NDWI and select new band name
var ndwi = sentinel.normalizedDifference(['B3', 'B8']).select(['nd'], ['ndwi']).clip(AOI);

// Calculate NDBI for urban area identification
var ndbi = sentinel.normalizedDifference(['B11', 'B8']).rename('ndbi').clip(AOI);

// Set an NDBI threshold to identify urban areas (adjust based on your area of interest)
var ndbiThreshold = 0.1;

// Use the NDBI threshold to mask urban areas


// Update mask based on NDWI and NDVI thresholds and add NDVI band
var image = sentinel.updateMask(ndwi.lt(0.3)).updateMask(ndvi.lt(0.2)).addBands(ndvi);

// Load SRTM Digital Elevation Model and calculate slope
var dem = ee.Image('USGS/SRTMGL1_003');
var slope = ee.Terrain.slope(dem);

// Set a slope threshold to filter out steep areas, e.g., mountains
var slopeThreshold = 10; // degrees

// Combine NDVI, NDWI, NDBI masks with slope filter
var combinedMask = ndwi.lt(0.3)
                        .and(ndvi.lt(0.2))
                        .and(ndbi.lt(0.1)) // if we want to exclude high NDBI values, indicating urban areas.
                        .and(slope.lt(slopeThreshold));
// Apply the combined mask to the sentinel image
var maskedImage = sentinel.updateMask(combinedMask).addBands(ndvi);


// Add the processed layer to the map
Map.addLayer(image.clip(AOI), s_rgb, 'Sentinel');

// Training data preparation
var solar = ee.FeatureCollection.randomPoints(solar, 1500).map(function(i) {
  return i.set({'class': 0});
});
 
var desert = ee.FeatureCollection.randomPoints(desert, 5000).map(function(i) {
  return i.set({'class': 1});
});
 

var mountain = ee.FeatureCollection.randomPoints(mountain, 3500).map(function(i) {
  return i.set({'class': 2});
});
 
var cropland = ee.FeatureCollection.randomPoints(cropland, 2000).map(function(i) {
  return i.set({'class': 3});
});

var urban = ee.FeatureCollection.randomPoints(urban, 1500).map(function(i) {
  return i.set({'class': 4});
});

// Combine and shuffle the training samples
var sample = ee.FeatureCollection([solar, desert, urban, mountain, cropland]).flatten().randomColumn();

// Split the samples into training and validation sets
var split = 0.7;
var training_sample = sample.filter(ee.Filter.lt('random', split));
var validation_sample = sample.filter(ee.Filter.gte('random', split));

// Sample the regions for training and validation
var training = image.sampleRegions({
  collection: training_sample,
  properties: ['class'],
  scale: 10,
});

var validation = image.sampleRegions({
  collection: validation_sample,
  properties: ['class'],
  scale: 10,
  
});


// Train a random forest classifier
var model = ee.Classifier.smileRandomForest({
  numberOfTrees:700, //improve stability. If computation resources are limited, consider fewer trees.
  variablesPerSplit: null,
  minLeafPopulation: 5, //Set a higher value (like 2-5) to avoid overfitting by limiting tree depth
  bagFraction: 0.5,
  maxNodes: null
}).train({
  features: training,
  classProperty: 'class'
});


// Classify the image
var prediction = image.classify(model);

// Mask the solar predictions
var solar = prediction.updateMask(prediction.eq(0));

// Add the solar prediction layer to the map
Map.addLayer(solar.clip(AOI), {palette: 'red'}, 'Predicted Solar Panels',false, 0.5);

/* To export the classifer, please use the following code:
Export.classifier.toAsset({
  classifier: model,
  description: 'exported_19_23',
  assetId: 'projects/ee-hnyhl3/assets/classifier2019'
});
*/

//Create a mask for Class 0 and display it
var class0Mask = solar.eq(0).selfMask(); //Use selfMask to ensure only Class 0 is displayed
Map.addLayer(class0Mask, {palette: ['FF0000']}, 'Predicted Class 0');

//Use a circular kernel
var kernel = ee.Kernel.circle({
  radius: 10,
  units: 'pixels',
  normalize: false  // Set to not normalize
});

var densityThreshold = 45;  //May need further adjustment based on actual conditions

var density = class0Mask.reduceNeighborhood({
  reducer: ee.Reducer.sum(),
  kernel: kernel
});


//Filter pixels based on density threshold
var filteredByDensity = density.gte(densityThreshold);
var finalMask = class0Mask.updateMask(filteredByDensity);

//Add the processed layer to the map
Map.addLayer(finalMask, {palette: ['0000FF']}, 'Density Filtered Class 0');


// Export the image to Earth Engine asset
Export.image.toAsset({
  image: finalMask.clip(AOI),
  description: 'Exported_Image_Asset_Ningxia',
  assetId: 'projects/ee-hnyhl3/assets/Image_2022',
  scale: 30,
  region: AOI,
  maxPixels: 1e9
});

//-----Validation-----

var validated = validation.classify(model);
var testAccuracy = validated.errorMatrix('class', 'classification');

print('Confusion Matrix ', testAccuracy);

print('Validation overall accuracy: ', testAccuracy.accuracy())