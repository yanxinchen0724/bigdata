
var largePanel = ui.Panel({
    layout: ui.Panel.Layout.flow('horizontal'),
    style: {stretch: 'horizontal'} 
  });
  
  var mapPanel = ui.Panel({
    style: {
      width: '75%', 
      height: commonHeight, 
      stretch: 'both' 
    }
  });
  
  var mainMap = ui.Map();
  
  mapPanel.add(mainMap);
  mainMap.setControlVisibility({all: true, zoomControl: false, layerList: true});
  
  
  // Create a panel for placing line charts
  var chartPanel = ui.Panel({
    style: {
      width: '25%',
      padding: '10px',
      height: commonHeight, 
    }
  });
  
  largePanel.add(chartPanel);
  largePanel.add(mapPanel);
  
  // Adjust the style of the chartPanel to ensure it displays to the right
  chartPanel.style().set({
    position: 'top-right',
    height: '100%' 
  })
  
  var commonHeight = '800px';
  
  
  // Title style
  var titleStyle = {
    fontWeight: 'bold',
    fontSize: '24px',
    margin: '0 0 4px 0', 
    padding: '0',
    color: '#111111', 
    textAlign: 'left' 
  };
  
  var title = ui.Label({
    value: 'Research on Ningxia Photovoltaic Power Station',
    style: titleStyle
  });
  
  // The first paragraph introduces text styles
  var intro1Style = {
    fontSize: '13px',
    color: '#111111', 
    padding: '0 0 4px 0', 
    whiteSpace: 'pre-wrap', 
    textAlign: 'left' 
  };
  
  var intro1 = ui.Label('This tool allows you to automatically identify and label photovoltaic power plants in Ningxia, China, for each year (1990-2020), through machine learning techniques (random forests), in time series data collected using Landsat.', intro1Style);
  
  // First level title style
  var statsLabelStyle = {
    fontWeight: 'bold',
    fontSize: '16px',
    color: '#111111', 
    padding: '0 0 4px 0', 
    whiteSpace: 'pre-wrap', 
    textAlign: 'left' 
  };
  
  
  //1.Total annual photovoltaic power station area in Ningxia
  var stats_label = ui.Label('1.Total annual photovoltaic power station area in Ningxia', statsLabelStyle);
  
  
  // Create a line chart
  function createLineChart() {
    var years = ee.List.sequence(2000, 2020); 
    var values = years.map(function(year) {
      return ee.Number(year).multiply(Math.random());
    });
  
    var yearValuePairs = years.zip(values);
  
   // Construct a FeatureCollection containing years and values
  var chartFeatures = ee.FeatureCollection([
    ee.Feature(null, {year: '2019', value: 210.52}),
    ee.Feature(null, {year: '2020', value: 228.64}),
    ee.Feature(null, {year: '2021', value: 268.36}),
    ee.Feature(null, {year: '2022', value: 296}),
    ee.Feature(null, {year: '2023', value: 350.93})
  ]);
    var lineChart = ui.Chart.feature.byFeature(chartFeatures, 'year', 'value')
      .setOptions({
        hAxis: {title: 'year'},
        vAxis: {title: 'value'},
        lineWidth: 1,
        series: {
        0: {
          color: '#3182bd', 
          lineWidth: 3 
        }
      }
      });
    
    return lineChart;
  }
  
  var lineChart = createLineChart(); 
  
  
  
  
  //---------------------------------
  //2.Annual photovoltaic power station area in each district of Ningxia (revised)
  
  
  // District area as classification
  var categories = ['Yinchuan', 'Wuzhong', 'Zhongwei', 'Guyuan', 'Shishan'];
  
  var values_2019 = [77.04, 56.50, 38.40, 0, 38.58];
  var values_2020 = [65.40, 48.77, 50.31, 0, 64.17];
  var values_2021 = [34.52, 44.60, 84.09, 0.62, 88.82];
  var values_2022 = [58.22, 59.87, 76.72, 0.05, 73.54];
  var values_2023 = [78.16, 76.26, 134.48, 0.52, 62.04];
  
  // Function to create a histogram
  function createBarChart(title, values) {
    return ui.Chart.array.values({
      array: values,
      axis: 0,
      xLabels: categories
    })
    .setChartType('BarChart')
    .setOptions({
      title: title,
      hAxis: {title: 'Area', minValue: 0},
      vAxis: {title: 'District'},
      bar: {groupWidth: '50%'},
      colors: ['#f3bcbd'],
      legend: {position: 'none'}
    });
  }
  
  // Chart initially shown for 2023
  var currentChart = createBarChart('Photovoltaic power station area in each administrative region in 2023', values_2023);
  
  // Create UI panels to display charts
  var chart1_Panel = ui.Panel({
    widgets: [currentChart],
    style: {width: '100%', height: '230px'}
  });
  
  
  //3.Related influencing factors
  var text_2 = ui.Label('3.Related influencing factors', statsLabelStyle);
  
  //----------------------------------------------
  
  
  
  //---------Compare map button -------------
  var dualMapPanelsCreated = false;
  
  var comparison_view_button = ui.Button({
    style: {stretch: 'horizontal'},
    label: 'Compare map',
    onClick: function ward_stats_panel() {
    
      //Hide panel
      Customised_Area_Panel.style().set('shown', false);
      legendPanel.style().set('shown', false);
      mapPanel.style().set('shown', false);
       createOrUpdateDualMapPanels();
       chartPanel.style().set('shown', false);
       chartPanel.style().set('shown', true);
   
    }
  });
  //------------------------------------------------------
  
  
  //----------------------Add Layers-----------------------------------------
  //---------------start
  // Set map center
  Map.setCenter(106.253352, 38.461084, 8);
  
  function addLayersToMap(mapObject) {
  var a_model = require('users/ucfnhaz/bigdata:yanxinchen/2_Model');
  var loadedModel = ee.Classifier.load('users/ucfnfou/classifier2023');
  var loadedModel_2019 = ee.Classifier.load('users/ucfnfou/classifier2019');
  
  var ImageProcessing = require('users/ucfnhaz/bigdata:yanxinchen/1_Pre_Processing');
  
  // RGB visualization parameters
  var s_rgb = {
    min: 0.0,
    max: 3000,
    bands: ['B4', 'B3', 'B2'],
    opacity: 1
  };
  
  // Predicted visualization parameters
  var visParams = {
    palette: ['#ff0000'],
    opacity: 0.5
  };
  
  var finalMask_2019 = a_model.processAndFilter(ningxia, loadedModel_2019, 2019, 200);
  var finalMask_2020 = a_model.processAndFilter(ningxia, loadedModel_2019, 2020, 273);
  var finalMask_2021 = a_model.processAndFilter(ningxia, loadedModel, 2021, 4);
  var finalMask_2022 = a_model.processAndFilter(ningxia, loadedModel, 2022, 40);
  var finalMask_2023 = a_model.processAndFilter(ningxia, loadedModel, 2023, 40);
  
  // factors visualization parameters
  var CO_viz = {
    min: 0.022,
    max: 0.053,
    palette: ['black', 'blue', 'purple', 'cyan', 'green', 'yellow', 'red']
  };
  
  var NO2_viz = {
    min: 0.00017,
    max: 0.00001,
    palette: ['black', 'blue', 'purple', 'cyan', 'green', 'yellow', 'red']
  };
  
  var SO2_viz = {
    min: -0.00004,
    max: 0.00062,
    palette: ['black', 'blue', 'purple', 'cyan', 'green', 'yellow', 'red']
  };
  
  var DSR_vis = {
    min: 0.35,
    max: 4.3,
    palette: ['0f17ff', 'b11406', 'f1ff23'],
  };
  
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
  
  //--------------------------2019--------------------------------------
  //------------------------------factors--------------------------------------------
    var CO_2019 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_CO_2019");
    var NO2_2019 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_NO2_2019");
    var SO2_2019 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_SO2_2019");
    var DSR_2019 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_DSR_2019");
    var LST_2019 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_LST_2019");
    
  // Add image to the map
    mapObject.addLayer(CO_2019, CO_viz, "CO");
    mapObject.addLayer(NO2_2019, NO2_viz, "NO2");
    mapObject.addLayer(SO2_2019, SO2_viz, "SO2");
    mapObject.addLayer(DSR_2019, DSR_vis, "DSR");
    mapObject.addLayer(LST_2019, LST_Vis, "LST");
  //------------------------------------------------------------------------------------------------------------
  //----------------------------layer------------------------------------
  // Call the preprocessing function to process the image
  var processedImages2019 = ImageProcessing.processImage(ningxia, loadedModel, 2019);//Change parameters
  
  // Add the processed layer to the map
  var image2019 = processedImages2019.image;
  var maskedImage2019 = processedImages2019.maskedImage;
  var sentinelRGB2019 = processedImages2019.sentinelRGB;
  
    mapObject.addLayer(sentinelRGB2019, {min: 0, max: 3000, gamma: 1.4}, 'Sentinel RGB');
  
  //----------------------------image----------------------------------------
    var Predicted2019 = ee.Image('projects/ee-hnyhl3/assets/Image_2019');
    // var Heatmap2019 = ee.Image('projects/ee-ucfnfou/assets/2019/Heatmap_2019');
    var Point2019 = ee.FeatureCollection('projects/ee-ucfnfou/assets/2019/Point_2019');
  
  var visualization2019 = {
    min: 0, 
    max: 350, 
    palette: ['#FFF4E0', '#FFE8C0', '#FFDBA0', '#FFCF80', '#FFC360', '#FFB740', '#FFAB20', '#FF9E00', '#FFA500'] 
  };
  
    mapObject.addLayer(Predicted2019, visParams, 'Predicted PV');
    // mapObject.addLayer(Heatmap2019, visualization2019, 'Heatmap');
    mapObject.addLayer(Point2019, {color: '#3182bd'}, 'PV Stations');
  //----------------------------------------------------------------------------------------------------------------
  
  
  //------------------------------------2020---------------------------------------------
  //------------------------------factors--------------------------------------------
    var CO_2020 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_CO_2020");
    var NO2_2020 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_NO2_2020");
    var SO2_2020 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_SO2_2020");
    var DSR_2020 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_DSR_2020");
    var LST_2020 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_LST_2020");
    
  // Add image to the map
    mapObject.addLayer(CO_2020, CO_viz, "CO");
    mapObject.addLayer(NO2_2020, NO2_viz, "NO2");
    mapObject.addLayer(SO2_2020, SO2_viz, "SO2");
    mapObject.addLayer(DSR_2020, DSR_vis, "DSR");
    mapObject.addLayer(LST_2020, LST_Vis, "LST");
  //------------------------------------------------------------------------------------------------------------
  //----------------------------layer------------------------------------
  // Call the preprocessing function to process the image
  var processedImages2020 = ImageProcessing.processImage(ningxia, loadedModel, 2020);
  // Add the processed layer to the map
  var image2020 = processedImages2020.image;
  var maskedImage2020 = processedImages2020.maskedImage;
  var sentinelRGB2020 = processedImages2020.sentinelRGB;
  
  // Add mage to the map
    mapObject.addLayer(sentinelRGB2020, {min: 0, max: 3000, gamma: 1.4}, 'Sentinel RGB');
  //----------------------------image----------------------------------------
    var Predicted2020 = ee.Image('projects/ee-hnyhl3/assets/Image_2020');
    // var Heatmap2020 = ee.Image('projects/ee-ucfnfou/assets/2020/Heatmap_2020');
    var Point2020 = ee.FeatureCollection('projects/ee-ucfnfou/assets/2020/Point_2020');
  
  
  var visualization2020 = {
    min: 0, 
    max: 400, 
    palette: ['#FFF4E0', '#FFE8C0', '#FFDBA0', '#FFCF80', '#FFC360', '#FFB740', '#FFAB20', '#FF9E00', '#FFA500'] 
  };
  
    // Add mage to the map
  mapObject.addLayer(Predicted2020, visParams, 'Predicted PV');
  // mapObject.addLayer(Heatmap2020, visualization2020, 'Heatmap');
  mapObject.addLayer(Point2020, {color: '#3182bd'}, 'PV Stations');
  //------------------------------------------------------------------------------------------------
  
  
  //------------------------------------2021---------------------------------------------
  //------------------------------factors--------------------------------------------
    var CO_2021 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_CO_2021");
    var NO2_2021 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_NO2_2021");
    var SO2_2021 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_SO2_2021");
    var DSR_2021 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_DSR_2021");
    var LST_2021 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_LST_2021");
    
  // Add mage to the map
    mapObject.addLayer(CO_2021, CO_viz, "CO");
    mapObject.addLayer(NO2_2021, NO2_viz, "NO2");
    mapObject.addLayer(SO2_2021, SO2_viz, "SO2");
    mapObject.addLayer(DSR_2021, DSR_vis, "DSR");
    mapObject.addLayer(LST_2021, LST_Vis, "LST");
  //------------------------------------------------------------------------------------------------------------
  //----------------------------layer------------------------------------
  // Call the preprocessing function to process the image
  var processedImages2021 = ImageProcessing.processImage(ningxia, loadedModel, 2021);
  // Add the processed layer to the map
  var image2021 = processedImages2021.image;
  var maskedImage2021 = processedImages2021.maskedImage;
  var sentinelRGB2021 = processedImages2021.sentinelRGB;
  
  
  // Add mage to the map
    mapObject.addLayer(sentinelRGB2021, {min: 0, max: 3000, gamma: 1.4}, 'Sentinel RGB');
  //----------------------------image----------------------------------------
    var Predicted2021 = ee.Image('projects/ee-hnyhl3/assets/Image_2021');
    // var Heatmap2021 = ee.Image('projects/ee-ucfnfou/assets/2021/Heatmap_2021');
    var Point2021 = ee.FeatureCollection('projects/ee-ucfnfou/assets/2021/Point_2021');
  
  
  var visualization2021 = {
    min: 0, 
    max: 200, 
    palette: ['#FFF4E0', '#FFE8C0', '#FFDBA0', '#FFCF80', '#FFC360', '#FFB740', '#FFAB20', '#FF9E00', '#FFA500'] 
  };
  
    // Add mage to the map
  mapObject.addLayer(Predicted2021, visParams, 'Predicted PV');
  // mapObject.addLayer(Heatmap2021, visualization2021, 'Heatmap');
  mapObject.addLayer(Point2021, {color: '#3182bd'}, 'PV Stations');
  //------------------------------------------------------------------------------------------------
  
  
  //------------------------------------2022---------------------------------------------
  //------------------------------factors--------------------------------------------
    var CO_2022 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_CO_2022");
    var NO2_2022 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_NO2_2022");
    var SO2_2022 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_SO2_2022");
    var DSR_2022 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_DSR_2022");
    var LST_2022 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_LST_2022");
    
  // Add mage to the map
    mapObject.addLayer(CO_2022, CO_viz, "CO");
    mapObject.addLayer(NO2_2022, NO2_viz, "NO2");
    mapObject.addLayer(SO2_2022, SO2_viz, "SO2");
    mapObject.addLayer(DSR_2022, DSR_vis, "DSR");
    mapObject.addLayer(LST_2022, LST_Vis, "LST");
  //------------------------------------------------------------------------------------------------------------
  //----------------------------layer------------------------------------
  // Call the preprocessing function to process the image
  var processedImages2022 = ImageProcessing.processImage(ningxia, loadedModel, 2022);
  // Add the processed layer to the map
  var image2022 = processedImages2022.image;
  var maskedImage2022 = processedImages2022.maskedImage;
  var sentinelRGB2022 = processedImages2022.sentinelRGB;
  var class0Mask2022 = processedImages2022.class0Mask;
  
  // Add mage to the map
    mapObject.addLayer(sentinelRGB2022, {min: 0, max: 3000, gamma: 1.4}, 'Sentinel RGB');
  //----------------------------image----------------------------------------
    var Predicted2022 = ee.Image('projects/ee-hnyhl3/assets/Image_2022');
    // var Heatmap2022 = ee.Image('projects/ee-ucfnfou/assets/2022/Heatmap_2022');
    var Point2022 = ee.FeatureCollection('projects/ee-ucfnfou/assets/2022/Point_2022');
  
  var visualization2022 = {
    min: 0, 
    max: 250, 
    palette: ['#FFF4E0', '#FFE8C0', '#FFDBA0', '#FFCF80', '#FFC360', '#FFB740', '#FFAB20', '#FF9E00', '#FFA500'] 
  };
  
    // Add mage to the map
  mapObject.addLayer(Predicted2022, visParams, 'Predicted PV');
  // mapObject.addLayer(Heatmap2022, visualization2022, 'Heatmap');
  mapObject.addLayer(Point2022, {color: '#3182bd'}, 'PV Stations');
  //------------------------------------------------------------------------------------------------
  
  //------------------------------------2023---------------------------------------------
  //------------------------------factors--------------------------------------------
    var CO_2023 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_CO_2023");
    var NO2_2023 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_NO2_2023");
    var SO2_2023 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_SO2_2023");
    var DSR_2023 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_DSR_2023");
    var LST_2023 = ee.Image("projects/ee-2024bsabd/assets/Ningxia_Mean_LST_2023");
    
  // Add mage to the map
    mapObject.addLayer(CO_2023, CO_viz, "CO");
    mapObject.addLayer(NO2_2023, NO2_viz, "NO2");
    mapObject.addLayer(SO2_2023, SO2_viz, "SO2");
    mapObject.addLayer(DSR_2023, DSR_vis, "DSR");
    mapObject.addLayer(LST_2023, LST_Vis, "LST");
  //------------------------------------------------------------------------------------------------------------
  //----------------------------layer------------------------------------
  // Call the preprocessing function to process the image
  var processedImages2023 = ImageProcessing.processImage(ningxia, loadedModel, 2023);
  // Add the processed layer to the map
  var image2023 = processedImages2023.image;
  var maskedImage2023 = processedImages2023.maskedImage;
  var sentinelRGB2023 = processedImages2023.sentinelRGB;
  var class0Mask2023 = processedImages2023.class0Mask;
  
  // Add image to the map
    mapObject.addLayer(sentinelRGB2023, {min: 0, max: 3000, gamma: 1.4}, 'Sentinel RGB');
  //----------------------------image----------------------------------------
    var Predicted2023 = ee.Image('projects/ee-hnyhl3/assets/Image_2023');
    // var Heatmap2023 = ee.Image('projects/ee-ucfnfou/assets/2023/Heatmap_2023');
    var Point2023 = ee.FeatureCollection('projects/ee-ucfnfou/assets/2023/Point_2023');
  
  var visualization2023 = {
    min: 0, 
    max: 250, 
    palette: ['#FFF4E0', '#FFE8C0', '#FFDBA0', '#FFCF80', '#FFC360', '#FFB740', '#FFAB20', '#FF9E00', '#FFA500'] 
  };
  
  mapObject.addLayer(Predicted2023, visParams, 'Predicted PV');
  // mapObject.addLayer(Heatmap2023, visualization2023, 'Heatmap');
  mapObject.addLayer(Point2023, {color: '#3182bd'}, 'PV Stations');
  //------------------------------------------------------------------------------------------------
  }
  
  // // //-------------------------------------------------------------------------------------------------
  // //------end---------------------------------------------- 