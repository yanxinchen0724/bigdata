// -------------- CO -------------
var CO_2019 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_CO_2019");
var CO_2020 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_CO_2020");
var CO_2021 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_CO_2021");
var CO_2022 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_CO_2022");
var CO_2023 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_CO_2023");

var CO_viz = {
  min: 0.022,
  max: 0.053,
  palette: ['black', 'blue', 'purple', 'cyan', 'green', 'yellow', 'red']
};

Map.addLayer(CO_2019, CO_viz, "CO 2019");
Map.addLayer(CO_2020, CO_viz, "CO 2020");
Map.addLayer(CO_2021, CO_viz, "CO 2021");
Map.addLayer(CO_2022, CO_viz, "CO 2022");
Map.addLayer(CO_2023, CO_viz, "CO 2023");


// -------------- NO2 -------------
var NO2_2019 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_NO2_2019");
var NO2_2020 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_NO2_2020");
var NO2_2021 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_NO2_2021");
var NO2_2022 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_NO2_2022");
var NO2_2023 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_NO2_2023");

// Define visualization parameters for NO2 column number density
var NO2_viz = {
  min: 0.00017,
  max: 0.00001,
  palette: ['black', 'blue', 'purple', 'cyan', 'green', 'yellow', 'red']
};

Map.addLayer(NO2_2019, NO2_viz, "NO2 2019");
Map.addLayer(NO2_2020, NO2_viz, "NO2 2020");
Map.addLayer(NO2_2021, NO2_viz, "NO2 2021");
Map.addLayer(NO2_2022, NO2_viz, "NO2 2022");
Map.addLayer(NO2_2023, NO2_viz, "NO2 2023");

// -------------- SO2 -------------
var SO2_2019 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_SO2_2019");
var SO2_2020 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_SO2_2020");
var SO2_2021 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_SO2_2021");
var SO2_2022 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_SO2_2022");
var SO2_2023 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_SO2_2023");

var SO2_viz = {
  min: -0.00004,
  max: 0.00062,
  palette: ['black', 'blue', 'purple', 'cyan', 'green', 'yellow', 'red']
};

Map.addLayer(SO2_2019, SO2_viz, "SO2 2019");
Map.addLayer(SO2_2020, SO2_viz, "SO2 2020");
Map.addLayer(SO2_2021, SO2_viz, "SO2 2021");
Map.addLayer(SO2_2022, SO2_viz, "SO2 2022");
Map.addLayer(SO2_2023, SO2_viz, "SO2 2023");

// -------------- DSR -------------
var DSR_2019 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_DSR_2019");
var DSR_2020 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_DSR_2020");
var DSR_2021 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_DSR_2021");
var DSR_2022 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_DSR_2022");
var DSR_2023 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_DSR_2023");

var DSR_vis = {
  min: 0.35,
  max: 4.3,
  palette: ['0f17ff', 'b11406', 'f1ff23'],
};

Map.addLayer(DSR_2019, DSR_vis, "DSR 2019");
Map.addLayer(DSR_2020, DSR_vis, "DSR 2020");
Map.addLayer(DSR_2021, DSR_vis, "DSR 2021");
Map.addLayer(DSR_2022, DSR_vis, "DSR 2022");
Map.addLayer(DSR_2023, DSR_vis, "DSR 2023");

// -------------- LST -------------
var LST_2019 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_LST_2019");
var LST_2020 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_LST_2020");
var LST_2021 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_LST_2021");
var LST_2022 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_LST_2022");
var LST_2023 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_LST_2023");

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

Map.addLayer(LST_2019, LST_Vis, "LST 2019");
Map.addLayer(LST_2020, LST_Vis, "LST 2020");
Map.addLayer(LST_2021, LST_Vis, "LST 2021");
Map.addLayer(LST_2022, LST_Vis, "LST 2022");
Map.addLayer(LST_2023, LST_Vis, "LST 2023");
