var ningxia = ee.FeatureCollection("projects/solarstationinspection/assets/Ningxia_District");

var ImageProcessing = require('users/ucfnhaz/bigdata:yanxinchen/1_Pre_Processing');

var loadedModel = ee.Classifier.load('users/ucfnhaz/classifier');

// Similar calls should already be present in the previous code
var processedImages = ImageProcessing.processImage(ningxia, loadedModel);

// Ensure that the processedImages object indeed contains the 'classifiedImage' property
var classifiedImage = processedImages.classifiedImage;

// Now the 'classifiedImage' variable can be used
var class0 = classifiedImage.eq(0);


// //-----------------3. Calculate total area and total area of solar farms---------------------------------
// Calculate the area classified as 0
var areaImage = class0.multiply(ee.Image.pixelArea()); // Calculate the area of these pixels
print('Classified image:', classifiedImage);
print('Area image:', areaImage);


// Perform regional statistics on the entire image
var area = areaImage.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: ningxia.geometry(),
  scale: 500, // Increase the scale value to reduce the number of pixels needed for calculations
  bestEffort: true, // Allows automatic scale adjustment
  maxPixels: 1e13 // Increase the value of maxPixels
});

print('Reduced area object:', area);


var AreaSqKm = ee.Number(area.get('classification')).divide(1e6);
print('Area classified as 0 (square kilometers):', AreaSqKm);

