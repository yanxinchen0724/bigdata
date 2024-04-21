var ningxia = ee.FeatureCollection("projects/ee-ucfnfou/assets/ningxiamap/NX3395");

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
var DSR_2019 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_DSR_2019");
var DSR_2020 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_DSR_2020");
var DSR_2021 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_DSR_2021");
var DSR_2022 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_DSR_2022");
var DSR_2023 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_DSR_2023");
var imageListDSR = [DSR_2019, DSR_2020, DSR_2021, DSR_2022, DSR_2023]; // 所有的识别结果图像
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
var imageListLST = [LST_2019, LST_2020, LST_2021, LST_2022, LST_2023]; // 所有的识别结果图像
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
var imageListSolar = [Solar_2019, Solar_2020, Solar_2021, Solar_2022, Solar_2023]; // 所有的识别结果图像
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
    color: 'blue', 
  };



var largePanel = ui.Panel({
  layout: ui.Panel.Layout.flow('horizontal'),
  style: {stretch: 'horizontal'} // Ensure the panel stretches horizontally to fill the entire space
});

var commonHeight = '800px'; // Define a common height for the panels

var mapPanel = ui.Panel({
  style: {
    width: '75%', // Specify the width
    height: commonHeight, // Use the common height
    stretch: 'both' // Stretch both horizontally and vertically within the available space
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
    width: '25%',
    padding: '10px',
    height: commonHeight // Use the common height
  }
});

largePanel.add(chartPanel);
largePanel.add(mapPanel);

// Adjust the style of the chartPanel to ensure it is aligned to the right
chartPanel.style().set({
  position: 'top-right',
  height: '100%' // Set the height as needed
});

// Title style
var titleStyle = {
  fontWeight: 'bold',
  fontSize: '24px',
  margin: '0 0 4px 0', // Top, right, bottom, left margins
  padding: '0',
  color: '#111111',
  textAlign: 'left' // Align text to the left
};

var title = ui.Label({
  value: 'Research on Photovoltaic Power Stations in Ningxia',
  style: titleStyle
});

// Introduction text style
var intro1Style = {
  fontSize: '13px',
  color: '#111111',
  padding: '0 0 4px 0', // Maintain left alignment with the title
  whiteSpace: 'pre-wrap', // Maintain line breaks
  textAlign: 'left' // Text aligned to the left
};

var intro1 = ui.Label('This tool uses machine learning techniques (Random Forest) to automatically identify and label annual data of photovoltaic power stations in Ningxia, China, using land satellite time-series data collected from 1990 to 2020.', intro1Style);

// Style for section titles
var statsLabelStyle = {
  fontWeight: 'bold',
  fontSize: '16px',
  color: '#111111',
  padding: '0 0 4px 0', // Maintain alignment with the title and introduction text
  whiteSpace: 'pre-wrap', // Maintain line breaks
  textAlign: 'left' // Text aligned to the left
};



// 1. Annual Total Area of Photovoltaic Power Stations in Ningxia

var stats_label = ui.Label('1. Annual Total Area of Photovoltaic Power Stations in Ningxia', statsLabelStyle);

// Function to create a line chart
function createLineChart() {
  // Generate line chart data by simulating random values for demonstration
  var years = ee.List.sequence(2000, 2020); // From the year 2000 to 2020
  var values = years.map(function(year) {
    // Assume each year's value is random
    return ee.Number(year).multiply(Math.random());
  });

  // Construct a FeatureCollection with years and values
  var chartFeatures = ee.FeatureCollection([
    ee.Feature(null, {year: '2019', value: 210.52}),
    ee.Feature(null, {year: '2020', value: 228.64}),
    ee.Feature(null, {year: '2021', value: 268.36}),
    ee.Feature(null, {year: '2022', value: 296}),
    ee.Feature(null, {year: '2023', value: 350.93})
  ]);
  
  // Create a line chart
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

// Generate and add the line chart to a panel
var lineChart = createLineChart(); // Call the function to generate the line chart
// Add the line chart to a panel



//---------------------------------

// 2. Annual Area of Photovoltaic Power Stations by District in Ningxia (Modification)

// District names as categories
var categories = ['Yinchuan', 'Wuzhong', 'Zhongwei', 'Guyuan', 'Shishan'];

// Annual areas of photovoltaic power stations for each district (sample data, modify as needed)
var values_2019 = [77.04, 56.50, 38.40, 0, 38.58];
var values_2020 = [65.40, 48.77, 50.31, 0, 64.17];
var values_2021 = [34.52, 44.60, 84.09, 0.62, 88.82];
var values_2022 = [58.22, 59.87, 76.72, 0.05, 73.54];
var values_2023 = [78.16, 76.26, 134.48, 0.52, 62.04];

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
    vAxis: {title: 'District'},
    bar: {groupWidth: '50%'},
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

var text_1 = ui.Label('2. Annual Area of Photovoltaic Power Stations by District in Ningxia', statsLabelStyle);
var intro2 = ui.Label('Select Year:', intro1Style);

var slider = ui.Slider({
  min: 2019, // Minimum value of the slider
  max: 2023, // Maximum value of the slider
  value: 2023, // Initial value of the slider
  step: 1, // Step size of the slider
  style: {stretch: 'horizontal', width: '100%'} // Style to stretch horizontally
});


var years = [2019, 2020, 2021, 2022, 2023];
for (var i = 0; i < imageListDSR.length; i++) {
  imageListDSR[i] = imageListDSR[i].set('year', years[i]);
  imageListLST[i] = imageListLST[i].set('year', years[i]);
  imageListSolar[i] = imageListSolar[i].set('year', years[i]);
  featureCollectionList[i] = featureCollectionList[i].set('year', years[i]);
}


var imageCollectionDSR = ee.ImageCollection.fromImages(imageListDSR);  
var imageCollectionLST = ee.ImageCollection.fromImages(imageListLST);  
var imageCollectionSolar = ee.ImageCollection.fromImages(imageListSolar);  
var imageCollectionPoints = ee.ImageCollection.fromImages(featureCollectionList.map(function (fc, index) {
  return ee.Image().set('year', years[index]).set('features', fc);
}));
   

// Function to update the main layer based on the selected year
function updateLayerMain(year) {
  year = parseInt(year); // Convert year to integer
  
  // Filter images by the selected year
  var imageDSR = imageCollectionDSR.filter(ee.Filter.eq('year', year)).first();
  var imageLST = imageCollectionLST.filter(ee.Filter.eq('year', year)).first();
  var imageListSolar = imageCollectionSolar.filter(ee.Filter.eq('year', year)).first();
  var featurePoints = featureCollectionList[year - 2019];
  var result = ImageProcessing.processImage(year);
  var sentinelRGB = result.sentinelRGB;
  
  // Set layers with respective visual parameters
  mainMap.layers().set(0, ui.Map.Layer(sentinelRGB, s_rgb, 'Sentinel RGB', true));
  mainMap.layers().set(1, ui.Map.Layer(imageDSR, DSR_vis, "DSR", false));
  mainMap.layers().set(2, ui.Map.Layer(imageLST, LST_Vis, "LST", false));
  mainMap.layers().set(3, ui.Map.Layer(imageListSolar, visParams, "Solar", true));
  mainMap.layers().set(4, ui.Map.Layer(featurePoints, visPoints, "Points", true));
}

// Function to update left map layers
function updateLayerSubLeft(year) {
  year = parseInt(year); // Convert year to integer
  
  // Filter and retrieve images by year for left map
  var imageDSR = imageCollectionDSR.filter(ee.Filter.eq('year', year)).first();
  var imageLST = imageCollectionLST.filter(ee.Filter.eq('year', year)).first();
  var imageListSolar = imageCollectionSolar.filter(ee.Filter.eq('year', year)).first();
  var featurePoints = featureCollectionList[year - 2019];
  var result = ImageProcessing.processImage(year);
  var sentinelRGB = result.sentinelRGB;
  
  // Update layers on the left map
  leftMap.layers().set(0, ui.Map.Layer(sentinelRGB, s_rgb, 'Sentinel RGB', true));
  leftMap.layers().set(1, ui.Map.Layer(imageDSR, DSR_vis, "DSR", false));
  leftMap.layers().set(2, ui.Map.Layer(imageLST, LST_Vis, "LST", false));
  leftMap.layers().set(3, ui.Map.Layer(imageListSolar, visParams, "Solar", true));
  leftMap.layers().set(4, ui.Map.Layer(featurePoints, visPoints, "Points", true));
}

// Function to update right map layers
function updateLayerSubRight(year) {
  year = parseInt(year); // Convert year to integer
  
  // Filter and retrieve images by year for right map
  var imageDSR = imageCollectionDSR.filter(ee.Filter.eq('year', year)).first();
  var imageLST = imageCollectionLST.filter(ee.Filter.eq('year', year)).first();
  var imageListSolar = imageCollectionSolar.filter(ee.Filter.eq('year', year)).first();
  var featurePoints = featureCollectionList[year - 2019];
  var result = ImageProcessing.processImage(year);
  var sentinelRGB = result.sentinelRGB;
  
  // Update layers on the right map
  rightMap.layers().set(0, ui.Map.Layer(sentinelRGB, s_rgb, 'Sentinel RGB', true));
  rightMap.layers().set(1, ui.Map.Layer(imageDSR, DSR_vis, "DSR", false));
  rightMap.layers().set(2, ui.Map.Layer(imageLST, LST_Vis, "LST", false));
  rightMap.layers().set(3, ui.Map.Layer(imageListSolar, visParams, "Solar", true));
  rightMap.layers().set(4, ui.Map.Layer(featurePoints, visPoints, "Points", true));
}

// Function to update visuals based on slider input
function updateVisuals(selectedYear) {
  // Update charts first
  chart1_Panel.clear();
  
  // Display the appropriate chart based on selected year
  switch (selectedYear) {
    case 2019:
      chart1_Panel.add(createBarChart('2019 District Photovoltaic Power Station Area', values_2019));
      break;
    case 2020:
      chart1_Panel.add(createBarChart('2020 District Photovoltaic Power Station Area', values_2020));
      break;
    case 2021:
      chart1_Panel.add(createBarChart('2021 District Photovoltaic Power Station Area', values_2021));
      break;
    case 2022:
      chart1_Panel.add(createBarChart('2022 District Photovoltaic Power Station Area', values_2022));
      break;
    case 2023:
      chart1_Panel.add(createBarChart('2023 District Photovoltaic Power Station Area', values_2023));
      break;
  }

  // Then update map layers
  updateLayerMain(selectedYear);
}

// Function to handle changes in slider position
function handleSliderChange(year) {
  currentSelectedYear = year;
  console.log('Slider selected year updated to: ', currentSelectedYear);
}

// Function to check if a district has been clicked
function checkClickStatus() {
  if (isFeatureClicked === 1 && currentDistrictName !== null) {
    updateInfoPanel(currentSelectedYear, currentDistrictName);
  } else {
    console.log('No district selected.');
  }
}

// Attach a function to slider that updates visuals when slider is used
slider.onSlide(function(value) {
  updateVisuals(value);
  handleSliderChange(value);
  checkClickStatus();
});




// Section 3: Related Influencing Factors

var text_2 = ui.Label('3. Related Influencing Factors', statsLabelStyle);

//---------------------------------------------------

// Function to generate random data
function generateRandomData() {
  var data = [];
  for (var i = 1; i <= 5; i++) {
    data.push({
      'category': 'Category ' + i,
      'value': Math.floor(Math.random() * 100) // Generate a random number between 0 and 100
    });
  }
  return data;
}

// Create Bar Chart 1
var chart1Data = generateRandomData();
var chart1 = ui.Chart.array.values(chart1Data.map(function (item) { return item.value; }), 0, chart1Data.map(function (item) { return item.category; }))
                .setChartType('ColumnChart')
                .setOptions({
                    title: 'Random Data Bar Chart 1',
                    hAxis: {title: 'Category'},
                    vAxis: {title: 'Value'},
                    legend: { position: "none" },
                    bar: { groupWidth: '60%' }, 
                    colors: ['#3182bd']
                });

// Create Bar Chart 2
var chart2Data = generateRandomData();
var chart2 = ui.Chart.array.values(chart2Data.map(function (item) { return item.value; }), 0, chart2Data.map(function (item) { return item.category; }))
                .setChartType('ColumnChart')
                .setOptions({
                    title: 'Random Data Bar Chart 2',
                    hAxis: {title: 'Category'},
                    vAxis: {title: 'Value'},
                    legend: { position: "none" },
                    bar: { groupWidth: '60%' }, 
                    colors: ['#3182bd']
                });

// Create a panel to display the charts side by side
var two_chart_Panel = ui.Panel({
    widgets: [chart1, chart2],
    layout: ui.Panel.Layout.flow('horizontal')
});

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
    backgroundColor: 'rgba(255, 255, 255, 0)', // Set background to transparent
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
      margin: '0px 8px',  // 保持与颜色条的边距一致
    }
  });
  
var rightlegendTitle_2 = ui.Label({
  value: 'DSR',
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
      margin: '0px 8px',  // 保持与颜色条的边距一致
    }
  });  
  
  
// Combine all elements into the legend panel
right_legend_Panel.add(rightlegendTitle_1);
right_legend_Panel.add(rightlegendColors_1);
right_legend_Panel.add(rightmaxmin_1);
right_legend_Panel.add(rightlegendTitle_2);
right_legend_Panel.add(rightlegendColors_2);
right_legend_Panel.add(rightmaxmin_2);


// Track whether the right map has been created to prevent duplication
var rightMapCreated = false;

// Function to add layers to the right map
function addLayersToRightMap() {
  if (!rightMapCreated) { // If the right map has not been created yet
    // Add the dropdown menu panel to the right map
    rightMap.add(rightyearSelectPanel);
    rightMap.addLayer(DSR_2023, DSR_vis, "DSR", false);
    rightMap.addLayer(LST_2023, LST_Vis, "LST", false);
    rightMap.addLayer(sentinelRGB, s_rgb, 'Sentinel RGB', true);
    rightMap.addLayer(Solar_2023, visParams, "Solar", true);
    rightMap.addLayer(Points_2023, visPoints, "Points", true);
    rightMap.add(right_legend_Panel);
    rightMapCreated = true; // Mark the right map as created
  } else {
    console.log("Right map already created."); // Log a message if the map is already set up
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
    backgroundColor: 'rgba(255, 255, 255, 0)', // Set background to transparent
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
      margin: '0px 8px',  // 保持与颜色条的边距一致
    }
  });
  
var leftlegendTitle_2 = ui.Label({
  value: 'DSR',
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
      margin: '0px 8px',  // 保持与颜色条的边距一致
    }
  });  
  
  
// Combine all elements into the legend panel
left_legend_Panel.add(leftlegendTitle_1);
left_legend_Panel.add(leftlegendColors_1);
left_legend_Panel.add(leftmaxmin_1);
left_legend_Panel.add(leftlegendTitle_2);
left_legend_Panel.add(leftlegendColors_2);
left_legend_Panel.add(leftmaxmin_2);


// Track whether the left map has been created to prevent duplication
var leftMapCreated = false;

// Function to add layers to the left map
function addLayersToLeftMap() {
  if (!leftMapCreated) {
    // Add the dropdown menu panel to the left map
    leftMap.add(leftyearSelectPanel);
    leftMap.addLayer(DSR_2023, DSR_vis, "DSR", false);
    leftMap.addLayer(LST_2023, LST_Vis, "LST", false);
    leftMap.addLayer(sentinelRGB, s_rgb, 'Sentinel RGB', true);
    leftMap.addLayer(Solar_2023, visParams, "Solar", true);
    leftMap.addLayer(Points_2023, visPoints, "Points", true);
    leftMap.add(left_legend_Panel);
    leftMapCreated = true; // Mark the left map as created
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
  style: { stretch: 'horizontal' }, // Stretch the button horizontally to fill its container
  label: 'Main View', // Text displayed on the button
  // Function to execute when the button is clicked
  onClick: function() {
    // Show the map panel and other related panels
    mapPanel.style().set('shown', true); // Show the map panel
    legendPanel.style().set('shown', true); // Show the legend panel
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
      dimensions: '100x6',  // Adjust the size as needed
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
      margin: '0px 8px',  // Keep the margin consistent with the color bar
    }
  });
  legendPanel.add(labelsPanel);
}

// Predefined color palettes
var randomPalette1 = ['#d73027', '#fc8d59', '#fee08b', '#d9ef8b', '#91cf60', '#1a9850'];
var randomPalette2 = ['0f17ff', '3233c5', '6550ab', '9874d1', 'ca98f7', 'fcbce4', 'fde4c8', 'ffcdac', 'ffb490', 'ff8c74', 'ff6458', 'ff3c3c', 'b11406'];

// Add all legend bars
addGradientLegend('LST', randomPalette1);
addGradientLegend('DSR', randomPalette2);


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
      isInfoPanelAdded = true; // Update the flag to indicate that the info panel has been added
    }

    // Highlight the selected region
    if (highlightLayer) {
      // If a highlight layer already exists, update it
      highlightLayer.setEeObject(highlight.style({ color: '#FFDBA0' }));
    } else {
      // If a highlight layer does not exist, create it and add to the map
      highlightLayer = mapInstance.addLayer(highlight.style({ color: '#FFDBA0' }), {}, 'Highlighted City');
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
        isFeatureClicked = 0; // Update click status to not realized
        updateInfoPanel('Unknown Area');
      }
    });
  });
}

// ------------------------End of Feature Highlighting Functionality--------------------------------

  
var data = {
  '2019': {
    'Yinchuan': { 'area': 20, 'density': 2 },
    'Wuzhong': { 'area': 30, 'density': 3 },
    'Zhongwei': { 'area': 10, 'density': 1 },
    'Guyuan': { 'area': 30, 'density': 0.5 },
    'Shishanzui': { 'area': 30, 'density': 0.5 }
  },
  '2020': {
   'Yinchuan': { 'area': 5, 'density': 2 },
    'Wuzhong': { 'area': 6, 'density': 3 },
    'Zhongwei': { 'area': 10, 'density': 1 },
    'Guyuan': { 'area': 30, 'density': 0.5 },
    'Shishanzui': { 'area': 30, 'density': 0.5 }
  },
  '2021': {
   'Yinchuan': { 'area': 20, 'density': 2 },
    'Wuzhong': { 'area': 9, 'density': 3 },
    'Zhongwei': { 'area': 10, 'density': 1 },
    'Guyuan': { 'area': 7, 'density': 0.5 },
    'Shishanzui': { 'area': 30, 'density': 0.5 }
  },
  '2022': {
   'Yinchuan': { 'area': 20, 'density': 2 },
    'Wuzhong': { 'area': 30, 'density': 3 },
    'Zhongwei': { 'area': 10, 'density': 1 },
    'Guyuan': { 'area': 8, 'density': 0.5 },
    'Shishanzui': { 'area': 30, 'density': 0.5 }
  },
  '2023': {
    'Yinchuan': { 'area': 30, 'density': 2 },
    'Wuzhong': { 'area': 30, 'density': 3 },
    'Zhongwei': { 'area': 50, 'density': 1 },
    'Guyuan': { 'area': 7, 'density': 0.5 },
    'Shishanzui': { 'area': 30, 'density': 0.5 }
  }
};

 var infoPanel = ui.Panel({
    style: { width: '130px', position: 'bottom-right' , backgroundColor: 'rgba(255, 255, 255, 1)' }
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
    infoPanel.add(ui.Label('Density: ', boldStyle).setValue('Density: ' + regionData.density));
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
  mainMap.addLayer(DSR_2023, DSR_vis, "DSR", false);
  mainMap.addLayer(LST_2023, LST_Vis, "LST", false);
  mainMap.addLayer(sentinelRGB, s_rgb, 'Sentinel RGB', true);
  mainMap.addLayer(Solar_2023, visParams, "Solar", true);
  mainMap.addLayer(Points_2023, visPoints, "Points", true);
  
  // Add the legend panel to the main map
  mainMap.add(legendPanel);
  
  // Style configuration
  var style = {
    color: 'red', // The color you want
    fillColor: '00000000', // Fill color, transparent here
    width: 1 // Border line width
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
  chartPanel.add(two_chart_Panel);
  chartPanel.add(comparison_view_button);
  chartPanel.add(main_interface_button);
};

// Call the home function to set up the main interface
home();

// ------------------------Main Page Configuration End-----------------------------------------------
