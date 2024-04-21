var ningxia = ee.FeatureCollection("projects/brian20000930/assets/NX3395");
var loadedModel = ee.Classifier.load('users/brian20000930/classifier');
-
// Set the map center to a location in Ningxia
Map.setCenter(106.253352, 38.461084, 9); 


// Define the start and end dates
var start = '2019-04-01';
var end = '2019-07-01';
// Specify the bands of interest
var bands = ['B2', 'B3', 'B4','B5','B6','B7','B8', 'B8A','B11','B12'];

// Load Sentinel-2 ImageCollection, filter by date and cloud percentage, and take the mean
var sentinel = ee.ImageCollection('COPERNICUS/S2_SR')
                  .filterBounds(ningxia)
                  .filter(ee.Filter.date(start, end))
                  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10))
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
var ndvi = sentinel.normalizedDifference(['B8', 'B4']).select(['nd'], ['ndvi']).clip(ningxia);

// Calculate NDWI and select new band name
var ndwi = sentinel.normalizedDifference(['B3', 'B8']).select(['nd'], ['ndwi']).clip(ningxia);

// Calculate NDBI for urban area identification
var ndbi = sentinel.normalizedDifference(['B11', 'B8']).rename('ndbi').clip(ningxia);

// Set an NDBI threshold to identify urban areas (adjust based on your area of interest)
var ndbiThreshold = 0.1;

// Use the NDBI threshold to mask urban areas
var nonUrbanImage = sentinel.updateMask(ndbi.lt(ndbiThreshold));

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
Map.addLayer(image.clip(ningxia), s_rgb, 'Sentinel');


var classifiedImage = image.classify(loadedModel);
var class0Mask = classifiedImage.eq(0).selfMask(); 
Map.addLayer(class0Mask, {palette: ['FF0000']}, 'Predicted Class 0');


var kernel = ee.Kernel.circle({
  radius: 10,
  units: 'pixels',
  normalize: false  
});

var densityThreshold = 100;  

var density = class0Mask.reduceNeighborhood({
  reducer: ee.Reducer.sum(),
  kernel: kernel
});


// use filter
var filteredByDensity = density.gte(densityThreshold);
var finalMask = class0Mask.updateMask(filteredByDensity);

// add map
Map.addLayer(finalMask, {palette: ['0000FF']}, 'Density Filtered Class 0');
