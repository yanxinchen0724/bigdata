var table = ee.FeatureCollection("projects/ee-2024bsabd/assets/SRx4"),
    table2 = ee.FeatureCollection("projects/ee-2024bsabd/assets/LSTx1");
var ningxia = ee.FeatureCollection("projects/ee-ucfnfou/assets/ningxiamap/NX3395");

// Set the map center to a location in Ningxia
Map.setCenter(106.253352, 38.461084, 9); 


var a = 2023;
var currentSelectedYear = 2023;

// Call the processImage function and pass in the year.
var ImageProcessing = require('users/ucfnhaz/bigdata:yanxinchen/1_Pre_Processing');
var result = ImageProcessing.processImage(a);
var sentinelRGB = result.sentinelRGB;

var s_rgb = { min: 0.0, max: 3000, bands: ['B4', 'B3', 'B2'], opacity: 1 };


var leftMap = ui.Map();
var rightMap = ui.Map();

var isFeatureClicked = 0;
var currentDistrictName = null;

// Import all required assets.
var CO_2019 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_CO_2019");
var CO_2020 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_CO_2020");
var CO_2021 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_CO_2021");
var CO_2022 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_CO_2022");
var CO_2023 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_CO_2023");
var imageListCO = [CO_2019, CO_2020, CO_2021, CO_2022, CO_2023]; // 所有的识别结果图像
var CO_vis = {
  min: 0.022,
  max: 0.053,
  palette: ['black', 'blue', 'purple', 'cyan', 'green', 'yellow', 'red']
};



var NO2_2019 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_NO2_2019");
var NO2_2020 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_NO2_2020");
var NO2_2021 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_NO2_2021");
var NO2_2022 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_NO2_2022");
var NO2_2023 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_NO2_2023");
var imageListNO2 = [NO2_2019, NO2_2020, NO2_2021, NO2_2022, NO2_2023]; // 所有的识别结果图像
var NO2_vis = {
  min: 0.00017,
  max: 0.00001,
  palette: ['black', 'blue', 'purple', 'cyan', 'green', 'yellow', 'red']
};



var SO2_2019 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_SO2_2019");
var SO2_2020 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_SO2_2020");
var SO2_2021 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_SO2_2021");
var SO2_2022 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_SO2_2022");
var SO2_2023 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_SO2_2023");
var imageListSO2 = [SO2_2019, SO2_2020, SO2_2021, SO2_2022, SO2_2023]; // 所有的识别结果图像
var SO2_vis = {
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


var Solar_2019 = ee.Image("projects/brian20000930/assets/Image_2019");
var Solar_2020 = ee.Image("projects/ee-hnyhl3/assets/Image_2020");
var Solar_2021 = ee.Image("projects/ee-hnyhl3/assets/Image_2021");
var Solar_2022 = ee.Image("projects/ee-hnyhl3/assets/Image_2022");
var Solar_2023 = ee.Image("projects/brian20000930/assets/Image_2023");
var imageListSolar = [Solar_2019, Solar_2020, Solar_2021, Solar_2022, Solar_2023]; 
var visParams = {
  palette: ['#ff0000'],
  opacity: 0.5
};



var Points_2019 = ee.FeatureCollection("projects/brian20000930/assets/Point_2019");
var Points_2020 = ee.FeatureCollection("projects/ee-hnyhl3/assets/Point_2020");
var Points_2021 = ee.FeatureCollection("projects/ee-hnyhl3/assets/Point_2021");
var Points_2022 = ee.FeatureCollection("projects/ee-hnyhl3/assets/Point_2022");
var Points_2023 = ee.FeatureCollection("projects/brian20000930/assets/Point_2023");
var featureCollectionList = [Points_2019, Points_2020, Points_2021, Points_2022,Points_2023]; 
var visPoints = {
    color: '#3182bd', 
  };



var largePanel = ui.Panel({
  layout: ui.Panel.Layout.flow('horizontal'),
  style: {stretch: 'horizontal'} 
});

var commonHeight = '820px'; 
var mapPanel = ui.Panel({
  style: {
    width: '75%', 
    height: commonHeight, 
    stretch: 'both' 
  }
});

var mainMap = ui.Map();
mapPanel.add(mainMap);


// Set control visibility to allow users to control layer visibility
mainMap.setControlVisibility({
  all: true,
  zoomControl: false,
  layerList: true
});

// Create a panel to hold line charts
var chartPanel = ui.Panel({
  style: {
    width: '24%',
    height: commonHeight 
  }
});

largePanel.add(chartPanel);
largePanel.add(mapPanel);


chartPanel.style().set({
  position: 'top-right',
  height: '100%' 
});

// Text style
var titleStyle = {
  fontWeight: 'bold',
  fontSize: '24px',
  margin: '0 0 4px 0', 
  padding: '10px',
  color: '#111111',
  textAlign: 'left' 
};


var title = ui.Label({
  value: 'Research on the Construction of Photovoltaic Power Stations in the Ningxia Autonomous Region.',
  style: titleStyle,
});


var intro1Style = {
  fontSize: '15px',
  color: '#111111',
  padding: '0 0 4px 0', 
  whiteSpace: 'pre-wrap', 
  textAlign: 'left' 
};

var intro1 = ui.Label('This applictaion demonstrates the distribution of photovoltaic power stations in the Ningxia region of China from 2019 to 2023. Utilizing Random Forest algorithm, it trains on Sentinel-2 satellite imagery to identify the locations of existing, constructed photovoltaic facilities. The program quantifies the area occupied by these power stations within the region and conducts an analysis of pertinent factors..', intro1Style);

var statsLabelStyle = {
  fontWeight: 'bold',
  fontSize: '16px',
  color: '#111111',
  padding: '0 0 4px 0', 
  whiteSpace: 'pre-wrap', 
  textAlign: 'left'
};



// 1. Annual Total Area of Photovoltaic Power Stations in Ningxia

var stats_label = ui.Label('1. Annual Total Area of Photovoltaic Power Stations', statsLabelStyle);

// Function to create a line chart
function createLineChart() {
  var years = ee.List.sequence(2019, 2023); 
  var values = years.map(function(year) {
    return ee.Number(year).multiply(Math.random());
  });

  // Construct a FeatureCollection with years and values
  var chartFeatures = ee.FeatureCollection([
    ee.Feature(null, {year: '2019', value: 161.93}),
    ee.Feature(null, {year: '2020', value: 173.91}),
    ee.Feature(null, {year: '2021', value: 190.51}),
    ee.Feature(null, {year: '2022', value: 214.95}),
    ee.Feature(null, {year: '2023', value: 251.23})
  ]);
  
  var lineChart = ui.Chart.feature.byFeature(chartFeatures, 'year', 'value')
    .setOptions({
      hAxis: {title: 'Year'},
      vAxis: {title: 'Area (sq km)'},
      lineWidth: 1,
      series: {
        0: {color: '#3182bd', lineWidth: 3}
      }
    });
  
  return lineChart;
}

var lineChart = createLineChart(); 



//---------------------------------

// 2. Annual Area of Photovoltaic Power Stations by District in Ningxia 

// District names as categories
var categories = ['Yinchuan', 'Wuzhong', 'Zhongwei', 'Guyuan', 'Shizuishan'];

// Annual areas of photovoltaic power stations for each district
var values_2019 = [53.42, 33.84, 52.69, 0, 21.98];
var values_2020 = [52.96, 32.22, 61.55, 0, 27.18];
var values_2021 = [55.73, 47.29, 52.60, 0, 34.89];
var values_2022 = [69.53, 49.81, 63.04, 0, 32.57];
var values_2023 = [95.53, 67.66, 56.61, 0, 31.03];

// Function to create a bar chart
function createBarChart(title, values) {
  return ui.Chart.array.values({
    array: values,
    axis: 0,
    xLabels: categories
  })
  .setChartType('BarChart')
  .setOptions({
    title: title,
    hAxis: {title: 'Area (sq km)', minValue: 0},
    vAxis: {title: 'City'},
    bar: {groupWidth: '70%'},
    colors: ['#f3bcbd'],
    legend: {position: 'none'}
  });
}

// Display the chart for 2023 initially
var currentChart = createBarChart('2023 District Photovoltaic Power Station Areas', values_2023);

// Create a UI panel to display the chart
var chart1_Panel = ui.Panel({
  widgets: [currentChart],
  style: {width: '100%', height: '230px'}
});



// Time slider
var text_1 = ui.Label('2. Annual Area of Photovoltaic Power Stations by City', statsLabelStyle);
var intro2 = ui.Label('Select Year:', intro1Style);

var slider = ui.Slider({
  min: 2019, 
  max: 2023, 
  value: 2023, 
  step: 1, 
  style: {stretch: 'horizontal', width: '100%'} 
});


var years = [2019, 2020, 2021, 2022, 2023];
for (var i = 0; i < imageListDSR.length; i++) {
  imageListCO[i] = imageListCO[i].set('year', years[i]);
  imageListNO2[i] = imageListNO2[i].set('year', years[i]);
  imageListSO2[i] = imageListSO2[i].set('year', years[i]);
  imageListDSR[i] = imageListDSR[i].set('year', years[i]);
  imageListLST[i] = imageListLST[i].set('year', years[i]);
  imageListSolar[i] = imageListSolar[i].set('year', years[i]);
  featureCollectionList[i] = featureCollectionList[i].set('year', years[i]);
}

var imageCollectionCO = ee.ImageCollection.fromImages(imageListCO);
var imageCollectionNO2 = ee.ImageCollection.fromImages(imageListNO2);  
var imageCollectionSO2 = ee.ImageCollection.fromImages(imageListSO2); 
var imageCollectionDSR = ee.ImageCollection.fromImages(imageListDSR);  
var imageCollectionLST = ee.ImageCollection.fromImages(imageListLST);  
var imageCollectionSolar = ee.ImageCollection.fromImages(imageListSolar);  
var imageCollectionPoints = ee.ImageCollection.fromImages(featureCollectionList.map(function (fc, index) {
  return ee.Image().set('year', years[index]).set('features', fc);
}));
   

// Function to update the main layer based on the selected year
function updateLayerMain(year) {
  year = parseInt(year); 
  
  // Filter images by the selected year
  var imageCO = imageCollectionCO.filter(ee.Filter.eq('year', year)).first();
  var imageNO2 = imageCollectionNO2.filter(ee.Filter.eq('year', year)).first();
  var imageSO2 = imageCollectionSO2.filter(ee.Filter.eq('year', year)).first();
  var imageDSR = imageCollectionDSR.filter(ee.Filter.eq('year', year)).first();
  var imageLST = imageCollectionLST.filter(ee.Filter.eq('year', year)).first();
  var imageListSolar = imageCollectionSolar.filter(ee.Filter.eq('year', year)).first();
  var featurePoints = featureCollectionList[year - 2019];
  var result = ImageProcessing.processImage(year);
  var sentinelRGB = result.sentinelRGB;
  
  // Set layers with respective visual parameters
  mainMap.layers().set(0, ui.Map.Layer(sentinelRGB, s_rgb, 'Sentinel RGB', true));
  mainMap.layers().set(1, ui.Map.Layer(imageCO, CO_vis, "CO",false));
  mainMap.layers().set(2, ui.Map.Layer(imageNO2, NO2_vis, "NO2",false));
  mainMap.layers().set(3, ui.Map.Layer(imageSO2, SO2_vis, "SO2",false));
  mainMap.layers().set(4, ui.Map.Layer(imageDSR, DSR_vis, "DSR", false));
  mainMap.layers().set(5, ui.Map.Layer(imageLST, LST_Vis, "LST", false));
  mainMap.layers().set(6, ui.Map.Layer(imageListSolar, visParams, "Predicted photovoltaic station", true));
  mainMap.layers().set(7, ui.Map.Layer(featurePoints, visPoints, "Points", true));
}

// Function to update left map layers
function updateLayerSubLeft(year) {
  year = parseInt(year); // Convert year to integer
  
  // Filter and retrieve images by year for left map
  var imageCO = imageCollectionCO.filter(ee.Filter.eq('year', year)).first();
  var imageNO2 = imageCollectionNO2.filter(ee.Filter.eq('year', year)).first();
  var imageSO2 = imageCollectionSO2.filter(ee.Filter.eq('year', year)).first();
  var imageDSR = imageCollectionDSR.filter(ee.Filter.eq('year', year)).first();
  var imageLST = imageCollectionLST.filter(ee.Filter.eq('year', year)).first();
  var imageListSolar = imageCollectionSolar.filter(ee.Filter.eq('year', year)).first();
  var featurePoints = featureCollectionList[year - 2019];
  var result = ImageProcessing.processImage(year);
  var sentinelRGB = result.sentinelRGB;
  
  // Update layers on the left map
  leftMap.layers().set(0, ui.Map.Layer(sentinelRGB, s_rgb, 'Sentinel RGB', true));
  leftMap.layers().set(1, ui.Map.Layer(imageCO, CO_vis, "CO",false));
  leftMap.layers().set(2, ui.Map.Layer(imageNO2, NO2_vis, "NO2",false));
  leftMap.layers().set(3, ui.Map.Layer(imageSO2, SO2_vis, "SO2",false));
  leftMap.layers().set(4, ui.Map.Layer(imageDSR, DSR_vis, "DSR", false));
  leftMap.layers().set(5, ui.Map.Layer(imageLST, LST_Vis, "LST", false));
  leftMap.layers().set(6, ui.Map.Layer(imageListSolar, visParams, "Predicted photovoltaic station", true));
  leftMap.layers().set(7, ui.Map.Layer(featurePoints, visPoints, "Points", true));
}

// Function to update right map layers
function updateLayerSubRight(year) {
  year = parseInt(year); // Convert year to integer
  
  // Filter and retrieve images by year for right map
  var imageCO = imageCollectionCO.filter(ee.Filter.eq('year', year)).first();
  var imageNO2 = imageCollectionNO2.filter(ee.Filter.eq('year', year)).first();
  var imageSO2 = imageCollectionSO2.filter(ee.Filter.eq('year', year)).first();
  var imageDSR = imageCollectionDSR.filter(ee.Filter.eq('year', year)).first();
  var imageLST = imageCollectionLST.filter(ee.Filter.eq('year', year)).first();
  var imageListSolar = imageCollectionSolar.filter(ee.Filter.eq('year', year)).first();
  var featurePoints = featureCollectionList[year - 2019];
  var result = ImageProcessing.processImage(year);
  var sentinelRGB = result.sentinelRGB;
  
  // Update layers on the right map
  rightMap.layers().set(0, ui.Map.Layer(sentinelRGB, s_rgb, 'Sentinel RGB', true));
  rightMap.layers().set(1, ui.Map.Layer(imageCO, CO_vis, "CO",false));
  rightMap.layers().set(2, ui.Map.Layer(imageNO2, NO2_vis, "NO2",false));
  rightMap.layers().set(3, ui.Map.Layer(imageSO2, SO2_vis, "SO2",false));
  rightMap.layers().set(4, ui.Map.Layer(imageDSR, DSR_vis, "DSR", false));
  rightMap.layers().set(5, ui.Map.Layer(imageLST, LST_Vis, "LST", false));
  rightMap.layers().set(6, ui.Map.Layer(imageListSolar, visParams, "Predicted photovoltaic station", true));
  rightMap.layers().set(7, ui.Map.Layer(featurePoints, visPoints, "Points", true));
}



function updateVisuals(selectedYear) {
  // Update charts first
  chart1_Panel.clear();
  // Display the appropriate chart based on selected year
  switch (selectedYear) {
    case 2019:
      chart1_Panel.add(createBarChart('2019 Photovoltaic Power Stations Area in Ningxia by Cities', values_2019));
      break;
    case 2020:
      chart1_Panel.add(createBarChart('2020 Photovoltaic Power Stations Area in Ningxia by Cities', values_2020));
      break;
    case 2021:
      chart1_Panel.add(createBarChart('2021 Photovoltaic Power Stations Area in Ningxia by Cities', values_2021));
      break;
    case 2022:
      chart1_Panel.add(createBarChart('2022 Photovoltaic Power Stations Area in Ningxia by Cities', values_2022));
      break;
    case 2023:
      chart1_Panel.add(createBarChart('2023 Photovoltaic Power Stations Area in Ningxia by Cities', values_2023));
      break;
  }

  // Then update map layers
  updateLayerMain(selectedYear);
}

function handleSliderChange(year) {
  currentSelectedYear = year;
  console.log('Slider selected year updated to: ', currentSelectedYear);
}

function checkClickStatus() {
  if (isFeatureClicked === 1 && currentDistrictName !== null) {
    updateInfoPanel(currentSelectedYear, currentDistrictName);
  } else {
    console.log('No district selected.');
  }
}

// Attach a function to slider that updates visuals when slider is used
slider.onSlide(function(value) {
  // Function to update visuals based on slider input
  updateVisuals(value);
  // Function to handle changes in slider position
  handleSliderChange(value);
  // Function to check if a district has been clicked
  checkClickStatus();
});


// Section 3: Related Influencing Factors
var statsLabelStyle = {fontWeight: 'bold', fontSize: '18px', margin: '10px 0 10px 5px'};
var text_2 = ui.Label('3. Surface Radiation(SR)', statsLabelStyle);
var chartsPanel = ui.Panel({
      layout: ui.Panel.Layout.flow('horizontal'),
});

// Define a function to generate a sorted horizontal bar chart
function createAndAddSortedBarChart(featureCollection, levelType, year, panel) {
  
  var selectedData = featureCollection
    .filter(ee.Filter.eq('Level', levelType))
    .select(['Area', year]);

  var sortedData = selectedData.sort(year, false);

  var chart = ui.Chart.feature.byFeature({
    features: sortedData,
    xProperty: 'Area',
    yProperties: [year]
  })
  .setChartType('BarChart')
  .setOptions({
    title: levelType + ' Ranking of Surface Radiation in ' + year,
    hAxis: {title: 'Surface Radiation (w/m^2)'},
    vAxis: {title: levelType, textStyle: {fontSize: 10}, showTextEvery: 1},
    bars: 'horizontal',
    chartArea: {width: '70%', height: '80%'}, 
    series: {0: {color: '#3182bd'}},
    legend: {position: 'none'}
  });

  
  panel.add(chart);
  
}


// Define list of years
var years = ['2019', '2020', '2021', '2022', '2023'];

years.forEach(function(year) {
  createAndAddSortedBarChart(table, 'City', year, chartsPanel);
  createAndAddSortedBarChart(table, 'District', year, chartsPanel);
});
//---------------------------------------------------
//----------------------------------------------

var statsLabelStyle = {fontWeight: 'bold', fontSize: '18px', margin: '20px 0 12px 5px'};


var text_3 = ui.Label('4.Land Surface Temperature(LST)', statsLabelStyle);

var secondChartsPanel = ui.Panel({
    layout: ui.Panel.Layout.flow('horizontal'),
    //style: {width: '100%', overflow: 'scroll'}
});


function createAndAddSortedBarChart2(featureCollection, levelType, year, panel) {
  var selectedData = featureCollection
    .filter(ee.Filter.eq('Level', levelType))
    .select(['Area', year]);

  var sortedData = selectedData.sort(year, false);

  var chart = ui.Chart.feature.byFeature({
    features: sortedData,
    xProperty: 'Area',
    yProperties: [year]
  })
  .setChartType('BarChart')
  .setOptions({
    title: levelType + ' Ranking of Land Surface Temperature in ' + year,
    hAxis: {title: 'Land Surface Temperature (K)'},
    vAxis: {title: levelType, textStyle: {fontSize: 10}, showTextEvery: 1},
    bars: 'horizontal',
    chartArea: {width: '70%', height: '80%'},  
    series: {0: {color: '#FFA500'}},
    legend: {position: 'none'}
  });

  panel.add(chart);
}



var years = ['2019', '2020', '2021', '2022', '2023'];
table=table2

years.forEach(function(year) {
  createAndAddSortedBarChart2(table, 'City', year, secondChartsPanel);
  createAndAddSortedBarChart2(table, 'District', year, secondChartsPanel);
});



var mainPanel = ui.Panel({
    layout: ui.Panel.Layout.flow('vertical'),
    style: {width: '100%'}
});



ui.root.clear(); 
ui.root.add(mainPanel);




//---------------------------------------------------

// Comparison View Button
var dualMapPanelsCreated = false;

var comparison_view_button = ui.Button({
  style: {stretch: 'horizontal'},
  label: 'Comparison View',
  onClick: function() {
    // Hide the legend panel
    legendPanel.style().set('shown', false);
    mapPanel.style().set('shown', false);
    // Create two separate map panels and set them up for comparison
    createOrUpdateDualMapPanels();
    // Optionally refresh charts if needed
    chartPanel.style().set('shown', false);
    chartPanel.style().set('shown', true);
    addLayersToRightMap();
    addLayersToLeftMap();
  }
});
//------------------------------------------------------



// Right Panel Setup
var rightyearOptions = ['2019', '2020', '2021', '2022', '2023'];
// Create a dropdown menu for selecting the year
var rightyearSelect = ui.Select({
  items: rightyearOptions,
  placeholder: 'Select Year',
  value: '2023', // Set the default value
  onChange: function(selected) {
    updateLayerSubRight(selected);
    console.log('Selected layer: ' + selected);
  }
});

// Create a panel for the dropdown menu
var rightyearSelectPanel = ui.Panel({
  widgets: [rightyearSelect],
  layout: ui.Panel.Layout.flow('horizontal'),
  style: {
    position: 'top-left',
    padding: '2px',
    backgroundColor: 'rgba(255, 255, 255, 0)', 
    border: 'none'
  }
});

// Panel for displaying the legend
var right_legend_Panel = ui.Panel({
  style: {
    position: 'bottom-left',
    padding: '6px 12px'
  }
});


// Add a title to the legend panel
var rightlegendTitle_1 = ui.Label({
  value: 'LST',
  style: {
    fontWeight: 'bold',
    fontSize: '13px',
    margin: '0 8px 0 0',
    padding: '0'
  }
});

// Define the color palette for the legend
var palette1 = ['#d73027', '#fc8d59', '#fee08b', '#d9ef8b', '#91cf60', '#1a9850'];
var palette2 = ['0f17ff', '3233c5', '6550ab', '9874d1', 'ca98f7', 'fcbce4', 'fde4c8', 'ffcdac', 'ffb490', 'ff8c74', 'ff6458', 'ff3c3c', 'b11406'];
var palette3 = ['black', 'blue', 'purple', 'cyan', 'green', 'yellow', 'red'];
var palette4 = ['black', 'blue', 'purple', 'cyan', 'green', 'yellow', 'red'];
var palette5 = ['black', 'blue', 'purple', 'cyan', 'green', 'yellow', 'red'];

// Add a color bar to the legend panel
var rightlegendColors_1 = ui.Thumbnail({
  image: ee.Image.pixelLonLat().select(0),
  params: {
    bbox: [0, 0, 1, 0.1],
    dimensions: '100x10',
    format: 'png',
    min: 0,
    max: 1,
    palette: palette1,
  },
  style: {stretch: 'horizontal', margin: '0px 15px', maxHeight: '12px'},
});

  var minLabel = ui.Label('Min', {fontSize: '12px', margin: '0 0 0 8px'});
  var maxLabel = ui.Label('Max', {fontSize: '12px', margin: '0 8px 0 0', textAlign: 'right'});
  

  var rightmaxmin_1 = ui.Panel({
    widgets: [minLabel, ui.Label('', {stretch: 'horizontal'}), maxLabel],
    layout: ui.Panel.Layout.flow('horizontal'),
    style: {
      stretch: 'horizontal',
      margin: '0px 8px',  
    }
  });
  
var rightlegendTitle_2 = ui.Label({
  value: 'SR',
  style: {
    fontWeight: 'bold',
    fontSize: '13px',
    margin: '0 8px 0 0',
    padding: '0'
  }
});
  
var rightlegendColors_2 = ui.Thumbnail({
  image: ee.Image.pixelLonLat().select(0),
  params: {
    bbox: [0, 0, 1, 0.1],
    dimensions: '100x10',
    format: 'png',
    min: 0,
    max: 1,
    palette: palette2,
  },
  style: {stretch: 'horizontal', margin: '0px 15px', maxHeight: '12px'},
});

  var minLabel = ui.Label('Min', {fontSize: '12px', margin: '0 0 0 8px'});
  var maxLabel = ui.Label('Max', {fontSize: '12px', margin: '0 8px 0 0', textAlign: 'right'});
  

  var rightmaxmin_2 = ui.Panel({
    widgets: [minLabel, ui.Label('', {stretch: 'horizontal'}), maxLabel],
    layout: ui.Panel.Layout.flow('horizontal'),
    style: {
      stretch: 'horizontal',
      margin: '0px 8px',  
    }
  });  

var rightlegendTitle_3 = ui.Label({
  value: 'SO2/CO/NO2 Density',
  style: {
    fontWeight: 'bold',
    fontSize: '13px',
    margin: '10px 8px 0 0',
    padding: '0'
  }
});

var rightlegendColors_3 = ui.Thumbnail({
  image: ee.Image.pixelLonLat().select(0),
  params: {
    bbox: [0, 0, 1, 0.1],
    dimensions: '100x10',
    format: 'png',
    min: 0,
    max: 1,
    palette: palette3,
  },
  style: {stretch: 'horizontal', margin: '0px 15px', maxHeight: '12px'},
});

  var minLabel = ui.Label('Min', {fontSize: '12px', margin: '0 0 0 8px'});
  var maxLabel = ui.Label('Max', {fontSize: '12px', margin: '0 8px 0 0', textAlign: 'right'});
  

  var rightmaxmin_3 = ui.Panel({
    widgets: [minLabel, ui.Label('', {stretch: 'horizontal'}), maxLabel],
    layout: ui.Panel.Layout.flow('horizontal'),
    style: {
      stretch: 'horizontal',
      margin: '0px 8px',  
    }
  });
  

  
  
// Combine all elements into the legend panel
right_legend_Panel.add(rightlegendTitle_1);
right_legend_Panel.add(rightlegendColors_1);
right_legend_Panel.add(rightmaxmin_1);
right_legend_Panel.add(rightlegendTitle_2);
right_legend_Panel.add(rightlegendColors_2);
right_legend_Panel.add(rightmaxmin_2);
right_legend_Panel.add(rightlegendTitle_3);
right_legend_Panel.add(rightlegendColors_3);
right_legend_Panel.add(rightmaxmin_3);




// Track whether the right map has been created to prevent duplication
var rightMapCreated = false;

// Function to add layers to the right map
function addLayersToRightMap() {
  if (!rightMapCreated) { // If the right map has not been created yet
    // Add the dropdown menu panel to the right map
    rightMap.add(rightyearSelectPanel);
    rightMap.addLayer(SO2_2023, SO2_vis, "SO2", false);
    rightMap.addLayer(CO_2023, CO_vis, "CO", false);
    rightMap.addLayer(NO2_2023, NO2_vis, "NO2", false);
    rightMap.addLayer(LST_2023, LST_Vis, "LST", false);
    rightMap.addLayer(sentinelRGB, s_rgb, 'Sentinel RGB', true);
    rightMap.addLayer(Solar_2023, visParams, "Predicted photovoltaic station", true);
    rightMap.addLayer(Points_2023, visPoints, "Points", true);
    rightMap.add(right_legend_Panel);
    rightMapCreated = true; 
  } else {
    console.log("Right map already created."); 
  }
}
// End of right map setup





// Left Map Setup
var leftyearOptions = ['2019', '2020', '2021', '2022', '2023'];
// Create a dropdown menu for selecting the year
var leftyearSelect = ui.Select({
  items: leftyearOptions,
  placeholder: 'Select Year',
  value: '2023', // Set the default value
  onChange: function(selected) {
    updateLayerSubLeft(selected);
    console.log('Selected layer: ' + selected);
  }
});
//addGradientLegend('LST', randomPalette1);
// Create a panel for the dropdown menu
var leftyearSelectPanel = ui.Panel({
  widgets: [leftyearSelect],
  layout: ui.Panel.Layout.flow('horizontal'),
  style: {
    position: 'top-left', 
    padding: '2px',
    backgroundColor: 'rgba(255, 255, 255, 0)', 
    border: 'none'
  }
});

// Panel for displaying the legend
var left_legend_Panel = ui.Panel({
  style: {
    position: 'bottom-left',
    padding: '6px 12px'
  }
});


// Add a title to the legend panel
var leftlegendTitle_1 = ui.Label({
  value: 'LST',
  style: {
    fontWeight: 'bold',
    fontSize: '13px',
    margin: '0 8px 0 0',
    padding: '0'
  }
});

// Define the color palette for the legend
var palette1 = ['#d73027', '#fc8d59', '#fee08b', '#d9ef8b', '#91cf60', '#1a9850'];
var palette2 = ['0f17ff', '3233c5', '6550ab', '9874d1', 'ca98f7', 'fcbce4', 'fde4c8', 'ffcdac', 'ffb490', 'ff8c74', 'ff6458', 'ff3c3c', 'b11406'];
var palette3 = ['black', 'blue', 'purple', 'cyan', 'green', 'yellow', 'red'];
var palette4 = ['black', 'blue', 'purple', 'cyan', 'green', 'yellow', 'red'];
var palette5 = ['black', 'blue', 'purple', 'cyan', 'green', 'yellow', 'red'];

// Add a color bar to the legend panel
var leftlegendColors_1 = ui.Thumbnail({
  image: ee.Image.pixelLonLat().select(0),
  params: {
    bbox: [0, 0, 1, 0.1],
    dimensions: '100x10',
    format: 'png',
    min: 0,
    max: 1,
    palette: palette1,
  },
  style: {stretch: 'horizontal', margin: '0px 15px', maxHeight: '12px'},
});

  var minLabel = ui.Label('Min', {fontSize: '12px', margin: '0 0 0 8px'});
  var maxLabel = ui.Label('Max', {fontSize: '12px', margin: '0 8px 0 0', textAlign: 'right'});
  

  var leftmaxmin_1 = ui.Panel({
    widgets: [minLabel, ui.Label('', {stretch: 'horizontal'}), maxLabel],
    layout: ui.Panel.Layout.flow('horizontal'),
    style: {
      stretch: 'horizontal',
      margin: '0px 8px',  
    }
  });
  
var leftlegendTitle_2 = ui.Label({
  value: 'SR',
  style: {
    fontWeight: 'bold',
    fontSize: '13px',
    margin: '0 8px 0 0',
    padding: '0'
  }
});
  
var leftlegendColors_2 = ui.Thumbnail({
  image: ee.Image.pixelLonLat().select(0),
  params: {
    bbox: [0, 0, 1, 0.1],
    dimensions: '100x10',
    format: 'png',
    min: 0,
    max: 1,
    palette: palette2,
  },
  style: {stretch: 'horizontal', margin: '0px 15px', maxHeight: '12px'},
});

  var minLabel = ui.Label('Min', {fontSize: '12px', margin: '0 0 0 8px'});
  var maxLabel = ui.Label('Max', {fontSize: '12px', margin: '0 8px 0 0', textAlign: 'right'});
  

  var leftmaxmin_2 = ui.Panel({
    widgets: [minLabel, ui.Label('', {stretch: 'horizontal'}), maxLabel],
    layout: ui.Panel.Layout.flow('horizontal'),
    style: {
      stretch: 'horizontal',
      margin: '0px 8px',  
    }
  });  

var leftlegendTitle_3 = ui.Label({
  value: 'SO2/CO/NO2 Density',
  style: {
    fontWeight: 'bold',
    fontSize: '13px',
    margin: '8px 8px 0 0',
    padding: '0'
  }
});

var leftlegendColors_3 = ui.Thumbnail({
  image: ee.Image.pixelLonLat().select(0),
  params: {
    bbox: [0, 0, 1, 0.1],
    dimensions: '100x10',
    format: 'png',
    min: 0,
    max: 1,
    palette: palette3,
  },
  style: {stretch: 'horizontal', margin: '0px 15px', maxHeight: '12px'},
});

  var minLabel = ui.Label('Min', {fontSize: '12px', margin: '0 0 0 8px'});
  var maxLabel = ui.Label('Max', {fontSize: '12px', margin: '0 8px 0 0', textAlign: 'right'});
  

  var leftmaxmin_3 = ui.Panel({
    widgets: [minLabel, ui.Label('', {stretch: 'horizontal'}), maxLabel],
    layout: ui.Panel.Layout.flow('horizontal'),
    style: {
      stretch: 'horizontal',
      margin: '0px 8px',  
    }
  });

var leftlegendColors_3 = ui.Thumbnail({
  image: ee.Image.pixelLonLat().select(0),
  params: {
    bbox: [0, 0, 1, 0.1],
    dimensions: '100x10',
    format: 'png',
    min: 0,
    max: 1,
    palette: palette3,
  },
  style: {stretch: 'horizontal', margin: '0px 15px', maxHeight: '12px'},
});

  var minLabel = ui.Label('Min', {fontSize: '12px', margin: '0 0 0 8px'});
  var maxLabel = ui.Label('Max', {fontSize: '12px', margin: '0 8px 0 0', textAlign: 'right'});

  
  
// Combine all elements into the legend panel
left_legend_Panel.add(leftlegendTitle_1);
left_legend_Panel.add(leftlegendColors_1);
left_legend_Panel.add(leftmaxmin_1);
left_legend_Panel.add(leftlegendTitle_2);
left_legend_Panel.add(leftlegendColors_2);
left_legend_Panel.add(leftmaxmin_2);
left_legend_Panel.add(leftlegendTitle_3);
left_legend_Panel.add(leftlegendColors_3);
left_legend_Panel.add(leftmaxmin_3);




// Track whether the left map has been created to prevent duplication
var leftMapCreated = false;

// Function to add layers to the left map
function addLayersToLeftMap() {
  if (!leftMapCreated) {
    // Add the dropdown menu panel to the left map
    leftMap.add(leftyearSelectPanel);
    leftMap.addLayer(SO2_2023, SO2_vis, "SO2", false);
    leftMap.addLayer(CO_2023, CO_vis, "CO", false);
    leftMap.addLayer(NO2_2023, NO2_vis, "NO2", false);
    leftMap.addLayer(DSR_2023, DSR_vis, "DSR", false);
    leftMap.addLayer(LST_2023, LST_Vis, "LST", false);
    leftMap.addLayer(sentinelRGB, s_rgb, 'Sentinel RGB', true);
    leftMap.addLayer(Solar_2023, visParams, "Predicted photovoltaic station", true);
    leftMap.addLayer(Points_2023, visPoints, "Points", true);
    leftMap.add(left_legend_Panel);
    leftMapCreated = true; 
  } else {
    console.log("Left map already created."); // Log a message if the map is already set up
  }
}
// End of left map setup


//----------------------Add Layers-----------------------------------------
//---------------start


// Function to create or update dual map panels for comparison
function createOrUpdateDualMapPanels() {
  if (!dualMapPanelsCreated) {
    // Initialize the map panels
    var leftPanel = ui.Panel({widgets: [leftMap], style: {stretch: 'both'}});
    var rightPanel = ui.Panel({widgets: [rightMap], style: {stretch: 'both'}});

    // Set the map center for both left and right maps
    leftMap.centerObject(ningxia, 7);
    rightMap.centerObject(ningxia, 7);

    // Set control visibility for both maps
    leftMap.setControlVisibility({all: true, zoomControl: false, layerList: true});
    rightMap.setControlVisibility({all: true, zoomControl: false, layerList: true});
    
    // Sync zoom levels between the two maps
    var leftZoomListenerId = leftMap.onChangeZoom(syncZoom(leftMap, rightMap));
    var rightZoomListenerId = rightMap.onChangeZoom(syncZoom(rightMap, leftMap));

    // Register listeners to synchronize map centers
    var leftCenterListenerId = leftMap.onChangeCenter(syncCenter(leftMap, rightMap));
    var rightCenterListenerId = rightMap.onChangeCenter(syncCenter(rightMap, leftMap));

    // Add the panels to the large panel container
    largePanel.add(leftPanel);
    largePanel.add(rightPanel);

    // Mark that the dual map panels have been created
    dualMapPanelsCreated = true;
  } else {
    console.log('Map panels have already been created to avoid duplication.');
  }
}

// Function to synchronize the zoom level between two maps
function syncZoom(map1, map2) {
  return function(zoom) {
    map2.setZoom(zoom);
  };
}

// Function to synchronize the center position between two maps
function syncCenter(map1, map2) {
  return function(center) {
    map2.setCenter(center);
  };
}



// ---------------------------Start of Main View Button Creation------------------------------

// Create a button to return to the main view
var main_interface_button = ui.Button({
  style: { stretch: 'horizontal' }, 
  label: 'Main View', 
  // Function to execute when the button is clicked
  onClick: function() {
    // Show the map panel and other related panels
    mapPanel.style().set('shown', true); 
    legendPanel.style().set('shown', true); 
  }
});

// ---------------------------End of Main View Button Creation------------------------------



// ------------------------------------- Start Creating Legend Panel -------------------------------------

// First, initialize an empty legend panel and add it to the UI

var legendPanel = ui.Panel({
  style: {
    position: 'bottom-left',
    padding: '8px 15px'
  }
});
ui.root.add(legendPanel);

// Function to add a gradient color legend
function addGradientLegend(title, palette) {
  // Add a new legend title
  var legendTitle = ui.Label({
    value: title,
    style: {
      fontWeight: 'bold',
      fontSize: '15px',
      margin: '0 0 4px 0',
      padding: '0'
    }
  });
  legendPanel.add(legendTitle);

  // Add a color bar
  var legendColors = ui.Thumbnail({
    image: ee.Image.pixelLonLat().select(0),
    params: {
      bbox: [0, 0, 1, 0.1],
      dimensions: '100x6',  
      format: 'png',
      min: 0,
      max: 1,
      palette: palette
    },
    style: {stretch: 'horizontal', margin: '0px 8px', maxHeight: '20px'}
  });
  legendPanel.add(legendColors);
  
  // Add labels for the minimum and maximum values
  var minLabel = ui.Label('Min', {fontSize: '12px', margin: '0 0 0 8px'});
  var maxLabel = ui.Label('Max', {fontSize: '12px', margin: '0 8px 0 0', textAlign: 'right'});
  
  // Create a panel to align the Min and Max labels
  var labelsPanel = ui.Panel({
    widgets: [minLabel, ui.Label('', {stretch: 'horizontal'}), maxLabel],
    layout: ui.Panel.Layout.flow('horizontal'),
    style: {
      stretch: 'horizontal',
      margin: '0px 8px',  
    }
  });
  legendPanel.add(labelsPanel);
}

// Predefined color palettes
var randomPalette1 = ['#d73027', '#fc8d59', '#fee08b', '#d9ef8b', '#91cf60', '#1a9850'];
var randomPalette2 = ['0f17ff', '3233c5', '6550ab', '9874d1', 'ca98f7', 'fcbce4', 'fde4c8', 'ffcdac', 'ffb490', 'ff8c74', 'ff6458', 'ff3c3c', 'b11406'];
var randomPalette3 = ['black', 'blue', 'purple', 'cyan', 'green', 'yellow', 'red'];
var randomPalette4 = ['black', 'blue', 'purple', 'cyan', 'green', 'yellow', 'red'];
var randomPalette5 = ['black', 'blue', 'purple', 'cyan', 'green', 'yellow', 'red'];

// Add all legend bars
addGradientLegend('LST', randomPalette1);
addGradientLegend('SR', randomPalette2);
addGradientLegend('SO2/CO/NO2 Density', randomPalette3);
// ------------------------Start of Feature Highlighting Functionality--------------------------------

// Function to initialize the functionality for highlighting regions on the map
function initializeHighlightFeature(geojsonFeatureCollection, styleOptions, mapInstance) {
  styleOptions = {
    color: '#FFDBA0',
    opacity: 0
  };

  // Create an empty layer for highlighting purposes
  var highlightLayer;
  var isInfoPanelAdded = false;

  // Add click event handler to the map for highlighting clicked regions
  mapInstance.onClick(function(coords) {
    // Create a point at the clicked location
    var point = ee.Geometry.Point([coords.lon, coords.lat]);

    // Find the region under the clicked location
    var highlight = geojsonFeatureCollection.filterBounds(point);
  
    // Ensure the information panel is shown only once
    infoPanel.style().set('shown', true);
    infoPanel.clear();
  
    // If the info panel has not been added to the map instance, add it
    if (!isInfoPanelAdded) {
      mapInstance.add(infoPanel);
      isInfoPanelAdded = true; 
    }

    // Highlight the selected region
    if (highlightLayer) {
      // If a highlight layer already exists, update it
      highlightLayer.setEeObject(highlight.style({ color: '#FFB740' }));
      highlightLayer.setOpacity(0.6);
    } else {
      // If a highlight layer does not exist, create it and add to the map
      highlightLayer = mapInstance.addLayer(highlight.style({ color: '#FFB740' }), {}, 'Highlighted City');
      highlightLayer.setOpacity(0.6);
    }

    // Retrieve properties from the highlighted feature
    highlight.evaluate(function(featureCollection) {
      if (featureCollection.features.length > 0) {
        console.log('First feature in the collection:', featureCollection.features[0]);
        // Extract district name from the feature properties
        var name = featureCollection.features[0].properties.Name;
        currentDistrictName = name;
        // Update the info panel to display information about the region
        isFeatureClicked = 1; 
        updateInfoPanel(currentSelectedYear, name);
      } else {
        // If no feature is selected, update the info panel to show a default message
        isFeatureClicked = 0; 
        updateInfoPanel('Unknown Area');
      }
    });
  });
}

// ------------------------End of Feature Highlighting Functionality--------------------------------

  
var data = {
  '2019': {
    'Yinchuan': { 'area': 53.42, 'density': 7.90 },
    'Wuzhong': { 'area': 33.84, 'density': 2.00 },
    'Zhongwei': { 'area': 52.69, 'density': 3.86 },
    'Guyuan': { 'area': 0, 'density': 0.5 },
    'Shishanzui': { 'area': 21.98, 'density': 5.39 }
  },
  '2020': {
   'Yinchuan': { 'area': 52.96, 'density': 7.83 },
    'Wuzhong': { 'area': 32.22, 'density': 1.91 },
    'Zhongwei': { 'area': 61.55, 'density': 4.51 },
    'Guyuan': { 'area': 0, 'density': 0 },
    'Shishanzui': { 'area': 27.18, 'density': 6.66 }
  },
  '2021': {
   'Yinchuan': { 'area': 55.73, 'density': 8.24 },
    'Wuzhong': { 'area': 47.29, 'density': 2.80 },
    'Zhongwei': { 'area': 52.60, 'density': 3.86 },
    'Guyuan': { 'area': 0, 'density': 0 },
    'Shishanzui': { 'area': 34.89, 'density': 8.55 }
  },
  '2022': {
   'Yinchuan': { 'area': 69.53, 'density': 10.28 },
    'Wuzhong': { 'area': 49.81, 'density': 2.95 },
    'Zhongwei': { 'area': 63.04, 'density': 4.62 },
    'Guyuan': { 'area': 0, 'density': 0 },
    'Shishanzui': { 'area': 32.57, 'density': 7.98 }
  },
  '2023': {
    'Yinchuan': { 'area': 95.53, 'density': 14.13 },
    'Wuzhong': { 'area': 67.66, 'density': 4.00 },
    'Zhongwei': { 'area': 56.61, 'density': 4.15 },
    'Guyuan': { 'area': 0, 'density': 0 },
    'Shishanzui': { 'area': 31.03, 'density': 7.61 }
  }
};

 var infoPanel = ui.Panel({
    style: { width: '200px', position: 'bottom-right' , backgroundColor: 'rgba(255, 255, 255, 1)' }
  });
   infoPanel.style().set('shown', false);

// Function to update the information panel to display details of the clicked region
function updateInfoPanel(currentSelectedYear, districtName) {
  console.log(currentSelectedYear, districtName);

  // Display a message if no region is clicked or the clicked region is not within Ningxia Province
  if (!districtName || !data[currentSelectedYear] || !data[currentSelectedYear][districtName]) {
    infoPanel.clear();
    infoPanel.add(ui.Label('No region in Ningxia Province was clicked.'));
  } else {
    // If a region within Ningxia Province is clicked and data is found
    var regionData = data[currentSelectedYear][districtName];
    // Clear the old data display
    infoPanel.clear();
    var boldStyle = {fontWeight: 'bold', color: 'black'};
    // Add labels to the information panel with the district name, area, and density
   
    infoPanel.add(ui.Label('District: ', boldStyle).setValue('District: ' + districtName));
    infoPanel.add(ui.Label('Area: ', boldStyle).setValue('Area: ' + regionData.area + ' km²'));
    infoPanel.add(ui.Label('Density: ', boldStyle).setValue('Density: ' + regionData.density + ' *10^-9'));
  }
}
// ------------------------End of Feature Highlighting Functionality--------------------------------


// ------------------------Main Page Configuration Start-----------------------------------------------

// Define the layout and element addition logic for the main page
var home = function() {
  // Clear all child elements of the UI root node
  ui.root.clear();
  // Add the large panel to the UI root node
  ui.root.add(largePanel);
  // Set the main map's view center to the object specified by variable ningxia, with a zoom level of 7.5
  mainMap.centerObject(ningxia, 7.5);
  // Set the map's display type to hybrid (including satellite imagery and street maps)
  mainMap.setOptions('hybrid');
  
  // Add layers to the main map
  mainMap.addLayer(SO2_2023, SO2_vis, "SO2", false);
  mainMap.addLayer(CO_2023, CO_vis, "CO", false);
  mainMap.addLayer(NO2_2023, NO2_vis, "NO2", false);
  mainMap.addLayer(DSR_2023, DSR_vis, "DSR", false);
  mainMap.addLayer(LST_2023, LST_Vis, "LST", false);
  mainMap.addLayer(sentinelRGB, s_rgb, 'Sentinel RGB', true);
  mainMap.addLayer(Solar_2023, visParams, "Predicted photovoltaic station", true);
  mainMap.addLayer(Points_2023, visPoints, "Points", true);
  
  // Add the legend panel to the main map
  mainMap.add(legendPanel);
  
  // Style configuration
  var style = {
    color: 'red', 
    fillColor: '00000000', 
    width: 1 
  };

  // Initialize feature highlighting functionality on the main map
  initializeHighlightFeature(ningxia, style, mainMap);
  
  
  // Add widgets to the chart panel
  chartPanel.add(title);
  chartPanel.add(intro1);
  chartPanel.add(stats_label);
  chartPanel.add(lineChart);
  chartPanel.add(text_1);
  chartPanel.add(intro2);
  chartPanel.add(slider);
  chartPanel.add(chart1_Panel);
  chartPanel.add(text_2);
  chartPanel.add(chartsPanel);
  chartPanel.add(text_3);
  chartPanel.add(secondChartsPanel)
  chartPanel.add(comparison_view_button);
  chartPanel.add(main_interface_button);
};

// Call the home function to set up the main interface
home();

// ------------------------Main Page Configuration End-----------------------------------------------
