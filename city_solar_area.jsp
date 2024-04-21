var ImageProcessing = require('users/ucfnhaz/bigdata:yanxinchen/1_Pre_Processing');

var loadedModel = ee.Classifier.load('users/ucfnhaz/classifier');

// Similar calls should already be present in the previous code
var processedImages = ImageProcessing.processImage(ningxia, loadedModel);

// Ensure that the processedImages object indeed contains the 'classifiedImage' property
var classifiedImage = processedImages.classifiedImage;

// Now the 'classifiedImage' variable can be used
var class0 = classifiedImage.eq(0);

// Define a function to calculate the area for class 0
function calculateAreaForClass0(feature) {
  // Calculate the area classified as 0 using a server-side operation
  var areaImage = class0.multiply(ee.Image.pixelArea());
  var area = areaImage.reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: feature.geometry(),
    scale: 500,
    bestEffort: true,
    maxPixels: 1e13
  });

  // Set the property with the area calculated on the server
  return feature.set('class0_area', ee.Number(area.get('classification')).divide(1e6));
}

// Apply the function to each district feature (FeatureCollection)
var districtAreasWithClass0 = ningxia.map(calculateAreaForClass0);

// Retrieve the area for class 0 for each district and asynchronously display the results on the client-side
districtAreasWithClass0.evaluate(function(result) {
  if (result.features) {
    result.features.forEach(function(feature) {
      var districtName = feature.properties['Name']; // Ensure the property name matches that in the Shapefile
      var areaForClass0 = feature.properties['class0_area']; // Note this property name matches what was set above
      console.log('District: ' + districtName + ', Area classified as 0: ' + areaForClass0 + ' square kilometers');
    });
  } else {
    console.error('Unable to calculate area classified as 0');
  }
});
