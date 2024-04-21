var ningxia = ee.FeatureCollection("projects/ee-ucfnfou/assets/ningxiamap/NX3395");

// Image call
var CO_2019 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_CO_2019");
var CO_2020 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_CO_2020");
var CO_2021 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_CO_2021");
var CO_2022 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_CO_2022");
var CO_2023 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_CO_2023");
var imageListCO = [CO_2019, CO_2020, CO_2021, CO_2022, CO_2023]; 
var CO_viz = {
  min: 0.022,
  max: 0.053,
  palette: ['black', 'blue', 'purple', 'cyan', 'green', 'yellow', 'red']
};


var NO2_2019 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_NO2_2019");
var NO2_2020 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_NO2_2020");
var NO2_2021 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_NO2_2021");
var NO2_2022 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_NO2_2022");
var NO2_2023 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_NO2_2023");
var imageListNO2 = [NO2_2019, NO2_2020, NO2_2021, NO2_2022, NO2_2023]; 
var NO2_viz = {
  min: 0.00017,
  max: 0.00001,
  palette: ['black', 'blue', 'purple', 'cyan', 'green', 'yellow', 'red']
};


var SO2_2019 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_SO2_2019");
var SO2_2020 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_SO2_2020");
var SO2_2021 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_SO2_2021");
var SO2_2022 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_SO2_2022");
var SO2_2023 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_SO2_2023");
var imageListSO2 = [SO2_2019, SO2_2020, SO2_2021, SO2_2022, SO2_2023]; 
var SO2_viz = {
  min: -0.00004,
  max: 0.00062,
  palette: ['black', 'blue', 'purple', 'cyan', 'green', 'yellow', 'red']
}; 
    

var DSR_2019 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_DSR_2019");
var DSR_2020 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_DSR_2020");
var DSR_2021 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_DSR_2021");
var DSR_2022 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_DSR_2022");
var DSR_2023 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_DSR_2023");
var imageListDSR = [DSR_2019, DSR_2020, DSR_2021, DSR_2022, DSR_2023]; 
var DSR_vis = {
  min: 0.35,
  max: 4.3,
  palette: ['0f17ff', 'b11406', 'f1ff23'],
};

var LST_2019 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_LST_2019");
var LST_2020 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_LST_2020");
var LST_2021 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_LST_2021");    
var LST_2022 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_LST_2022");    
var LST_2023 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_LST_2023");
var imageListLST = [LST_2019, LST_2020, LST_2021, LST_2022, LST_2023]; 
var LST_Vis = {
  min: 280.0,
  max: 310.0,
  palette: [
    '040274', '040281', '0502a3', '0502b8', '0502ce', '0502e6',
    '0602ff', '235cb1', '307ef3', '269db1', '30c8e2', '32d3ef',
    '3be285', '3ff38f', '86e26f', '3ae237', 'b5e22e', 'd6e21f',
    'fff705', 'ffd611', 'ffb613', 'ff8b13', 'ff6e08', 'ff500d',
    'ff0000', 'de0101', 'c21301', 'a71001', '911003'
  ],
};


//---------------------------
// Create layers and set visualization parameters
var CO_layer = ui.Map.Layer(CO_2023, CO_viz, "CO", false); 
var NO2_layer = ui.Map.Layer(NO2_2023, NO2_viz, "NO2", false); 
var SO2_layer = ui.Map.Layer(SO2_2023, SO2_viz, "SO2", true); 
var DSR_layer = ui.Map.Layer(DSR_2023, DSR_vis, "DSR", true); 
var LST_layer = ui.Map.Layer(LST_2023, LST_Vis, "LST", true); 

// Add a layer to the map
Map.layers().add(CO_layer);
Map.layers().add(NO2_layer);
Map.layers().add(SO2_layer);
Map.layers().add(DSR_layer);
Map.layers().add(LST_layer);
Map.centerObject(ningxia, 7);

// Set year attribute for each image
var years = [2019, 2020, 2021, 2022, 2023];
for (var i = 0; i < imageListCO.length; i++) {
  imageListCO[i] = imageListCO[i].set('year', years[i]);
  imageListNO2[i] = imageListNO2[i].set('year', years[i]);
  imageListSO2[i] = imageListSO2[i].set('year', years[i]);
  imageListDSR[i] = imageListDSR[i].set('year', years[i]);
  imageListLST[i] = imageListLST[i].set('year', years[i]);
}

var imageCollectionNO2 = ee.ImageCollection.fromImages(imageListNO2);  
var imageCollectionSO2 = ee.ImageCollection.fromImages(imageListSO2); 
var imageCollectionDSR = ee.ImageCollection.fromImages(imageListDSR);  
var imageCollectionLST = ee.ImageCollection.fromImages(imageListLST);  
var imageCollectionCO = ee.ImageCollection.fromImages(imageListCO);
   

  print(imageCollectionCO);
  print(imageCollectionNO2);
  print(imageCollectionSO2);
  print(imageCollectionDSR);
  print(imageCollectionLST);


// Create slider
var yearSlider = ui.Slider({
  min: 2019,
  max: 2023,
  step: 1,
  value: 2019,
  style: {width: '200px'},
  onChange: updateLayer 
});

var panel = ui.Panel({widgets: [yearSlider], layout: ui.Panel.Layout.flow('horizontal')});
Map.add(panel);


// Update layer function
function updateLayer(year) {
  year = parseInt(year); 
  
  // Filter images based on year selected with slider
  var imageCO = imageCollectionCO.filter(ee.Filter.eq('year', year)).first();
  var imageNO2 = imageCollectionNO2.filter(ee.Filter.eq('year', year)).first();
  var imageSO2 = imageCollectionSO2.filter(ee.Filter.eq('year', year)).first();
  var imageDSR = imageCollectionDSR.filter(ee.Filter.eq('year', year)).first();
  var imageLST = imageCollectionLST.filter(ee.Filter.eq('year', year)).first();
  
  print(imageCO);
  print(imageNO2);
  print(imageSO2);
  print(imageDSR);
  print(imageLST);
  
    Map.layers().set(0, ui.Map.Layer(imageNO2, NO2_viz, "NO2", false));
    Map.layers().set(1, ui.Map.Layer(imageSO2, SO2_viz, "SO2", false));
    Map.layers().set(2, ui.Map.Layer(imageDSR, DSR_vis, "NO2", true));
    Map.layers().set(3, ui.Map.Layer(imageLST, LST_Vis, "DSR", true));
    Map.layers().set(4, ui.Map.Layer(imageCO, CO_viz, "CO", true));
}
