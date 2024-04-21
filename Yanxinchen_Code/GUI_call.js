var ningxia = ee.FeatureCollection("projects/solarstationinspection/assets/Ningxia_District");

exports.processImage = function(year) {
  // Set the start and end dates based on the input year
  var start = year + '-03-01';
  var end = year + '-05-01';
  // Specify the bands of interest
  var bands = ['B2', 'B3', 'B4','B5','B6','B7','B8', 'B8A','B11','B12'];

  // Load Sentinel-2 ImageCollection, filter by date and cloud coverage, and compute the mean
  var sentinel = ee.ImageCollection('COPERNICUS/S2_SR')
                    .filterBounds(ningxia)
                    .filter(ee.Filter.date(start, end))
                    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10))
                    .mean()
                    .select(bands);

  // RGB visualization parameters
  var s_rgb = { min: 0.0, max: 3000, bands: ['B4', 'B3', 'B2'], opacity: 1 };

  // Calculate NDVI and select new band names
  var ndvi = sentinel.normalizedDifference(['B8', 'B4']).select(['nd'], ['ndvi']).clip(ningxia);
  // Calculate NDWI and select new band names
  var ndwi = sentinel.normalizedDifference(['B3', 'B8']).select(['nd'], ['ndwi']).clip(ningxia);
  // Calculate NDBI for urban area detection
  var ndbi = sentinel.normalizedDifference(['B11', 'B8']).rename('ndbi').clip(ningxia);

  // Set an NDBI threshold to identify urban areas (adjust according to your area of interest)
  var ndbiThreshold = 0.1;
  // Mask urban areas using the NDBI threshold
  var nonUrbanImage = sentinel.updateMask(ndbi.lt(ndbiThreshold));

  // Update the mask based on NDWI and NDVI thresholds and add the NDVI band
  var image = sentinel.updateMask(ndwi.lt(0.3)).updateMask(ndvi.lt(0.2)).addBands(ndvi);

  var sentinelRGB = image.select(['B4', 'B3', 'B2']);

  // Return the result object
  return {
    sentinelRGB: sentinelRGB
  };
};
