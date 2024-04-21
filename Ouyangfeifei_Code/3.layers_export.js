var ningxia = ee.FeatureCollection("projects/ee-ucfnfou/assets/ningxiamap/NX3395");
// Set the map center to a location in Ningxia
Map.setCenter(106.253352, 38.461084, 9); 


var a_model = require('users/ucfnhaz/bigdata:yanxinchen/2_Model');
var loadedModel = ee.Classifier.load('users/ucfnfou/classifier2023');
var loadedModel_2019 = ee.Classifier.load('users/ucfnfou/classifier2019');

var ImageProcessing = require('users/ucfnhaz/bigdata:yanxinchen/1_Pre_Processing');


// 
var finalMask_2019 = a_model.processAndFilter(ningxia, loadedModel_2019, 2019, 200);

// var finalMask_2020 = a_model.processAndFilter(ningxia, loadedModel_2019, 2020, 273);

// var finalMask_2021 = a_model.processAndFilter(ningxia, loadedModel, 2021, 4);

// var finalMask_2022 = a_model.processAndFilter(ningxia, loadedModel, 2022, 40);

// var finalMask_2023 = a_model.processAndFilter(ningxia, loadedModel, 2023, 40);


// Call the preprocessing function to process the image
var processedImages = ImageProcessing.processImage(ningxia, loadedModel, 2019);//Change parameters

// Add the processed layer to the map
var image = processedImages.image;
var maskedImage = processedImages.maskedImage;
var sentinelRGB = processedImages.sentinelRGB;
var class0Mask = processedImages.class0Mask;

// RGB visualization parameters
var s_rgb = {
  min: 0.0,
  max: 3000,
  bands: ['B4', 'B3', 'B2'],
  opacity: 1
};

// Add layers to the map
Map.addLayer(image.clip(ningxia), s_rgb, 'Sentinel');
Map.addLayer(sentinelRGB, {min: 0, max: 3000, gamma: 1.4}, 'Sentinel RGB');
Map.addLayer(class0Mask, {palette: ['FF0000']}, 'Predicted Class 0');


 
// Define a function that calculates the area of category 0
function calculateAreaForClass0(feature) {
  var areaImage = finalMask_2019.multiply(ee.Image.pixelArea());//Change parameters
  var area = areaImage.reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: feature.geometry(),
    scale: 50,
    bestEffort: true,
    maxPixels: 1e13
  });

  return feature.set('class0_area', ee.Number(area.get('classification')).divide(1e6));
}

// Apply function to each distinct feature (FeatureCollection)
var districtAreasWithClass0 = ningxia.map(calculateAreaForClass0);

districtAreasWithClass0.evaluate(function(result) {
  if (result.features) {
    result.features.forEach(function(feature) {
      var districtName = feature.properties['Name']; 
      var areaForClass0 = feature.properties['class0_area']; 
      console.log('distinct: ' + districtName + ', Photovoltaic power station area: ' + areaForClass0 + ' km²');
    });
  } else {
    console.error('Unable to calculate area');
  }
});

//-----------------2.Using kernel functions to calculate heat maps based on area data--------------


var districtAreasImage = ee.Image().float().paint(districtAreasWithClass0, 'class0_area');

// Compute density based on area data using Gaussian kernel function
var gaussianKernel = ee.Kernel.gaussian({
  radius: 500, 
  sigma: 300, 
  units: 'meters',
  normalize: true
});

var districtHeatmap = districtAreasImage.convolve(gaussianKernel).clip(ningxia);

var heatmapPalette = ['#FFFFFF', '#FFF4E0', '#FFE8C0', '#FFDBA0', '#FFCF80', '#FFC360', '#FFB740', '#FFAB20', '#FF9E00', '#FFA500'];

Map.addLayer(districtHeatmap, {min: 0, max: 500, palette: heatmapPalette, opacity: 1}, 'District Heatmap');



//-----------------3.Photovoltaic power plant pixels converted into points--------------

var fakeBand = ee.Image.constant(1);

var class0WithFakeBand = class0Mask.addBands(fakeBand);

var class0Points = class0WithFakeBand.reduceToVectors({
  geometry: ningxia, 
  scale: 100, 
  geometryType: 'centroid', 
  eightConnected: true, 
  labelProperty: 'class', 
  reducer: ee.Reducer.mean(), 
});

Map.addLayer(class0Points, {color: '#3182bd'}, 'PV Stations');


//-----------export---------------

// Define export parameters
var exportParams4 = {
  image: districtHeatmap, 
  description: 'Heatmap_2019', 
  assetId: 'projects/ee-ucfnfou/assets/2021/Heatmap_2019', 
  scale: 500, 
  region: ningxia.geometry(), 
  maxPixels: 1e12 
};

var exportParams = {
  collection: class0Points, 
  description: 'point_2019', 
  assetId: 'projects/ee-ucfnfou/assets/2021/Point_2019', 
};

// Export images to GEE Assets
Export.image.toAsset(exportParams4);
Export.table.toAsset(exportParams);