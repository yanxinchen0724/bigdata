var ningxia = ee.FeatureCollection("projects/solarstationinspection/assets/Ningxia_District");
var a_model = require('users/ucfnhaz/bigdata:yanxinchen/2_Model');
var loadedModel = ee.Classifier.load('users/ucfnhaz/classifier_21_23');
var loadedModel_2019 = ee.Classifier.load('users/ucfnhaz/classifier2019');

var ImageProcessing = require('users/ucfnhaz/bigdata:yanxinchen/1_Pre_Processing');



//2019
var finalMask_2019 = a_model.processAndFilter(ningxia, loadedModel_2019, 2019, 200);
var areaImage_2019 = finalMask_2019.multiply(ee.Image.pixelArea()); // 

var area_2019 = areaImage_2019.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: ningxia.geometry(),
  scale: 50, 
  bestEffort: true, 
  maxPixels: 1e13 
});

var AreaSqKm_2019 = ee.Number(area_2019.get('classification')).divide(1e6);
var AreaSqKm_2019 = ee.Number.parse(AreaSqKm_2019.format('%.2f'));
print(AreaSqKm_2019);
//2019



//2020
var finalMask_2020 = a_model.processAndFilter(ningxia, loadedModel_2019, 2020, 273);
var areaImage_2020 = finalMask_2020.multiply(ee.Image.pixelArea()); 

var area_2020 = areaImage_2020.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: ningxia.geometry(),
  scale: 50, 
  bestEffort: true, 
  maxPixels: 1e13 
});

var AreaSqKm_2020 = ee.Number(area_2020.get('classification')).divide(1e6);
var AreaSqKm_2020 = ee.Number.parse(AreaSqKm_2020.format('%.2f'));
print(AreaSqKm_2020);
//2020




//2021
var finalMask_2021 = a_model.processAndFilter(ningxia, loadedModel, 2021, 4);
var areaImage_2021 = finalMask_2021.multiply(ee.Image.pixelArea()); 

var area_2021 = areaImage_2021.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: ningxia.geometry(),
  scale: 50, 
  bestEffort: true, 
  maxPixels: 1e13 
});


var AreaSqKm_2021 = ee.Number(area_2021.get('classification')).divide(1e6);
var AreaSqKm_2021 = ee.Number.parse(AreaSqKm_2021.format('%.2f'));
print(AreaSqKm_2021);
//2021



//2022
var finalMask_2022 = a_model.processAndFilter(ningxia, loadedModel, 2022, 40);
var areaImage_2022 = finalMask_2022.multiply(ee.Image.pixelArea()); 

var area_2022 = areaImage_2022.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: ningxia.geometry(),
  scale: 50, 
  bestEffort: true, 
  maxPixels: 1e13 
});


var AreaSqKm_2022 = ee.Number(area_2022.get('classification')).divide(1e6);
var AreaSqKm_2022 = ee.Number.parse(AreaSqKm_2022.format('%.2f'));
print(AreaSqKm_2022);
//2022





//2023

var finalMask_2023 = a_model.processAndFilter(ningxia, loadedModel, 2023, 40);
var areaImage_2023 = finalMask_2023.multiply(ee.Image.pixelArea()); 

var area_2023 = areaImage_2023.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: ningxia.geometry(),
  scale: 500, 
  bestEffort: true, 
  maxPixels: 1e13 
});


var AreaSqKm_2023 = ee.Number(area_2023.get('classification')).divide(1e6);
var AreaSqKm_2023 = ee.Number.parse(AreaSqKm_2023.format('%.2f'));
print(AreaSqKm_2023);

//2023




exports.AreaData = function( ) {

  var Area_2019 = AreaSqKm_2019;
  var Area_2020 = AreaSqKm_2020;
  var Area_2021 = AreaSqKm_2021;
  var Area_2022 = AreaSqKm_2022;
  var Area_2023 = AreaSqKm_2023;
  
  return {
    AreaSqKm_2019: AreaSqKm_2019,
    AreaSqKm_2020: AreaSqKm_2020,
    AreaSqKm_2021: AreaSqKm_2021,
    AreaSqKm_2022: AreaSqKm_2022,
    AreaSqKm_2023: AreaSqKm_2023}
};