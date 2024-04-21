var largePanel = ui.Panel({
    layout: ui.Panel.Layout.flow('horizontal'),
    style: {stretch: 'horizontal'} // Ensure the Panel horizontally stretches to fill the entire horizontal space
  });
  
  var mapPanel = ui.Panel({
    style: {
      width: '75%', // Specify width as 100%
      height: commonHeight, // Use a common height
      stretch: 'both' // Stretch both horizontally and vertically within the available space
    }
  });
  
  var mainMap = ui.Map();
  mapPanel.add(mainMap);
  
  // Create a panel for placing line charts
  var chartPanel = ui.Panel({
    style: {
      width: '25%',
      padding: '10px',
      height: commonHeight, // Use a common height
    }
  });
  
  largePanel.add(mapPanel);
  largePanel.add(chartPanel);
  
  // Adjust the style of chartPanel to ensure it is displayed on the right
  chartPanel.style().set({
    position: 'top-right',
    height: '100%' // Set height as needed
  })
  
  var commonHeight = '800px';
  
  // Title style
  var titleStyle = {
    fontWeight: 'bold',
    fontSize: '24px',
    margin: '0 0 4px 0', // top, right, bottom, left
    padding: '0',
    color: '#1a9641', // Title color, using dark green here
    textAlign: 'left' // Text aligned left
  };
  
  var title = ui.Label({
    value: 'Study of Photovoltaic Power Station Conditions in Xinjiang',
    style: titleStyle
  });
  
  // Style for the first introductory text
  var intro1Style = {
    fontSize: '13px',
    color: '#555', // Dark gray text
    padding: '0 0 4px 0', // Aligned left with the title
    whiteSpace: 'pre-wrap', // Keep line breaks
    textAlign: 'left' // Text aligned left
  };
  
  var intro1 = ui.Label('This tool uses machine learning technology (random forests) to mark all photovoltaic stations on a map of Xinjiang, China. ' +
                        'Data layers can be toggled using the "Layers" tab.', intro1Style);
  
  // Style for statistical information labels
  var statsLabelStyle = {
    fontSize: '13px',
    color: '#555', // Dark gray text
    padding: '0 0 4px 0', // Aligned left with the title and the first introductory text
    whiteSpace: 'pre-wrap', // Keep line breaks
    textAlign: 'left' // Text aligned left
  };
  
  var stats_label = ui.Label('To explore administrative district-level data of photovoltaic stations in Xinjiang, or factors influencing photovoltaic stations, please click the button below.', statsLabelStyle);
  
  
  // Creating a function to create a line chart
  function createLineChart() {
    // Generate line chart data, here we randomly generate some data for simulation
    var years = ee.List.sequence(2000, 2020); // From the year 2000 to 2020
    var values = years.map(function(year) {
      // Assume each year's value is random
      return ee.Number(year).multiply(Math.random());
    });
  
    // Create a dictionary to pair years with corresponding values
    var yearValuePairs = years.zip(values);
  
    // Convert to FeatureCollection for use in Charts
    var chartFeatures = ee.FeatureCollection(yearValuePairs.map(function(pair) {
      pair = ee.List(pair); // Convert pair to ee.List
      return ee.Feature(null, {'year': pair.get(0), 'value': pair.get(1)});
    }));
  
    // Create a line chart
    var lineChart = ui.Chart.feature.byFeature(chartFeatures, 'year', 'value')
      .setOptions({
        title: 'Random Data Annual Trend',
        hAxis: {title: 'Year'},
        vAxis: {title: 'Value'},
        lineWidth: 1
      });
    
    return lineChart;
  }
  
  // Use the function to create a line chart and add it to the panel
  var lineChart = createLineChart(); // Call the function to generate a line chart
  
  chartPanel.add(title);
  chartPanel.add(intro1);
  chartPanel.add(stats_label);
  chartPanel.add(lineChart);
  
  // Create a time slider
  var text_1 = ui.Label('Please select a year:', statsLabelStyle);
  
  var slider = ui.Slider({
    min: 2000, // Set the minimum value of the slider
    max: 2020, // Set the maximum value of the slider
    value: 2014, // Set the initial value of the slider
    step: 1, // Set the step size for changes in the slider
    style: {stretch: 'horizontal'} // Set the slider to stretch horizontally
  });
  
  // Set a callback function for when the slider changes
  slider.onSlide(function(value) {
    // Here you can add code you want to execute when the slider changes
    // The value parameter is the current value of the slider
    print('The selected year is:', value);
  });
  
  chartPanel.add(text_1);
  chartPanel.add(slider);
  
  // Define an array for simulated data
  var categories = ['Category One', 'Category Two', 'Category Three', 'Category Four', 'Category Five'];
  var values = [868, 814, 791, 743, 703]; // Corresponding values
  
  // Use ui.Chart.array.values to generate a horizontal bar chart
  var chart = ui.Chart.array.values(values, 0, categories)
    .setChartType('BarChart') // Set the chart type to horizontal bar chart
    .setOptions({
      title: 'National Business Busyness Index (2011-2022)',
      hAxis: {
        title: 'Busyness Index',
        minValue: 0,
      },
      vAxis: {
        title: 'Region',
      },
      bar: { groupWidth: '60%' },
      legend: { position: 'none' }
    });
  
  // Add a click event listener to the chart
  chart.onClick(function(xValue, yValue, seriesName) {
    // When the bar chart is clicked, you can perform actions based on xValue or yValue
    // For example, print the clicked category and value
    console.log('You clicked on category: ' + xValue + ', with a value of: ' + yValue);
  });
  
  chartPanel.add(chart);
  
  var text_2 = ui.Label('The following is a chart of six influencing factors:', statsLabelStyle);
  
  chartPanel.add(text_2);
  
  // Generate random data function
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
                      legend: { position: "none" }
                  });
  
  // Create Bar Chart 2
  var chart2Data = generateRandomData();
  var chart2 = ui.Chart.array.values(chart2Data.map(function (item) { return item.value; }), 0, chart2Data.map(function (item) { return item.category; }))
                  .setChartType('ColumnChart')
                  .setOptions({
                      title: 'Random Data Bar Chart 2',
                      hAxis: {title: 'Category'},
                      vAxis: {title: 'Value'},
                      legend: { position: "none" }
                  });
  
  // Create a panel to display charts side by side
  var two_chart_Panel = ui.Panel({
      widgets: [chart1, chart2],
      layout: ui.Panel.Layout.flow('horizontal')
  });
  
  chartPanel.add(two_chart_Panel);
  
  // Comparison view button
  var dualMapPanelsCreated = false;
  
  var comparison_view_button = ui.Button({
    style: {stretch: 'horizontal'},
    label: 'Comparison View',
    onClick: function ward_stats_panel() {
    
      // Hide the Customised_Area_Panel panel
      Customised_Area_Panel.style().set('shown', false);
      // Hide the legend panel
      legend_Panel.style().set('shown', false);
      mapPanel.style().set('shown', false);
      // Create two separate map panels and set them to comparison view
      createOrUpdateDualMapPanels();
      chartPanel.style().set('shown', false);
      chartPanel.style().set('shown', true);
    }
  });
  
  chartPanel.add(comparison_view_button);
  
  function createOrUpdateDualMapPanels() {
    if (!dualMapPanelsCreated) {
      // Initialize maps
      var leftMap = ui.Map();
      var rightMap = ui.Map();
  
      // Initialize panels
      var leftPanel = ui.Panel({widgets: [leftMap], style: {stretch: 'both'}});
      var rightPanel = ui.Panel({widgets: [rightMap], style: {stretch: 'both'}});
  
      // Set map center
      leftMap.centerObject(ningxia, 7);
      rightMap.centerObject(ningxia, 7);
  
      // Set control visibility, allowing the user to control the visibility of layers
      leftMap.setControlVisibility({all: false, zoomControl: false, layerList: false});
      rightMap.setControlVisibility({all: false, zoomControl: false, layerList: false});
  
      // Register map zoom and center listeners to synchronize maps
      var leftZoomListenerId = leftMap.onChangeZoom(syncZoom(leftMap, rightMap));
      var rightZoomListenerId = rightMap.onChangeZoom(syncZoom(rightMap, leftMap));
  
      var leftCenterListenerId = leftMap.onChangeCenter(syncCenter(leftMap, rightMap));
      var rightCenterListenerId = rightMap.onChangeCenter(syncCenter(rightMap, leftMap));
  
      // Add panels to the largePanel
      largePanel.add(leftPanel);
      largePanel.add(rightPanel);
  
      // Update flag to avoid recreating panels
      dualMapPanelsCreated = true;
    } else {
      console.log('Map panels already created, avoiding duplication.');
    }
  }
  
  // Function to synchronize map zoom
  function syncZoom(map1, map2) {
    return function(zoom) {
      map2.setZoom(zoom);
    };
  }
  
  // Function to synchronize map center
  function syncCenter(map1, map2) {
    return function(center) {
      map2.setCenter(center);
    };
  }
  
  // Configuration for the left map
  // Year selection
  var leftyearOptions = ['2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'];
  var leftyearSelect = ui.Select({
    items: leftyearOptions,
    placeholder: 'Select Year',
    onChange: function(selected) {
      // Operations based on the selected layer, e.g., adding it to the map
      console.log('Selected layer: ' + selected);
    }
  });
  
  var leftyearSelectPanel = ui.Panel({
    widgets: [leftyearSelect],
    layout: ui.Panel.Layout.flow('horizontal'),
    style: {
      position: 'top-left', 
      padding: '4px',
      backgroundColor: 'rgba(255, 255, 255, 0)', // Set background to transparent
      border: 'none' 
    }
  });
  
  leftMap.add(leftyearSelectPanel);
  
  // Layer selection
  var leftlayerOptions = ['Layer 1', 'Layer 2', 'Layer 3'];
  var leftlayerSelect = ui.Select({
    items: leftlayerOptions,
    placeholder: 'Select Layer',
    onChange: function(selected) {
      // Operations based on the selected layer, e.g., adding it to the map
      console.log('Selected layer: ' + selected);
    }
  });
  
  var leftlayerSelectPanel = ui.Panel({
    widgets: [leftlayerSelect],
    layout: ui.Panel.Layout.flow('horizontal'),
    style: {
      position: 'top-left', 
      padding: '4px',
      backgroundColor: 'rgba(255, 255, 255, 0)', // Set background to transparent
      border: 'none' 
    }
  });
  
  leftMap.add(leftlayerSelectPanel);
  
  // Legend
  var left_legend_Panel = ui.Panel({
    style: {
      position: 'bottom-left',
      padding: '6px 12px'
    }
  });
  
  var leftlegendTitle = ui.Label({
    value: 'Estimated Damage',
    style: {
      fontWeight: 'bold',
      fontSize: '13px',
      margin: '0 8px 0 0',
      padding: '0'
    }
  });
  
  var palette =['#ffffb2', '#fed976', '#feb24c', '#fd8d3c', '#f03b20', '#bd0026'];
  
  var leftlegendColors = ui.Thumbnail({
    image: ee.Image.pixelLonLat().select(0),
    params: {
      bbox: [0, 0, 1, 0.1],
      dimensions: '100x10',
      format: 'png',
      min: 0,
      max: 1,
      palette: palette,
    },
    style: {stretch: 'horizontal', margin: '0px 15px', maxHeight: '12px'},
  });
  
  var leftmaxmin = ui.Panel({
    widgets: [
      ui.Label(palette[0]),
      ui.Label(palette[palette.length - 1], {textAlign: 'right'})
    ],
    layout: ui.Panel.Layout.flow('horizontal')
  });
  
  left_legend_Panel.add(leftlegendTitle);
  left_legend_Panel.add(leftlegendColors);
  left_legend_Panel.add(leftmaxmin);
  
  leftMap.add(left_legend_Panel);
  
  // Configuration for the right map
  // Year selection
  var rightyearOptions = ['2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'];
  var rightyearSelect = ui.Select({
    items: rightyearOptions,
    placeholder: 'Select Year',
    onChange: function(selected) {
      // Operations based on the selected layer, e.g., adding it to the map
      console.log('Selected layer: ' + selected);
    }
  });
  
  var rightyearSelectPanel = ui.Panel({
    widgets: [rightyearSelect],
    layout: ui.Panel.Layout.flow('horizontal'),
    style: {
      position: 'top-right', 
      padding: '4px',
      backgroundColor: 'rgba(255, 255, 255, 0)', // Set background to transparent
      border: 'none' 
    }
  });
  
  rightMap.add(rightyearSelectPanel);
  
  // Layer selection
  var rightlayerOptions = ['Layer 1', 'Layer 2', 'Layer 3'];
  var rightlayerSelect = ui.Select({
    items: rightlayerOptions,
    placeholder: 'Select Layer',
    onChange: function(selected) {
      // Operations based on the selected layer, e.g., adding it to the map
      console.log('Selected layer: ' + selected);
    }
  });
  
  var rightlayerSelectPanel = ui.Panel({
    widgets: [rightlayerSelect],
    layout: ui.Panel.Layout.flow('horizontal'),
    style: {
      position: 'top-right', 
      padding: '4px',
      backgroundColor: 'rgba(255, 255, 255, 0)', // Set background to transparent
      border: 'none' 
    }
  });
  
  rightMap.add(rightlayerSelectPanel);
  
  // Legend
  var right_legend_Panel = ui.Panel({
    style: {
      position: 'bottom-right',
      padding: '6px 12px'
    }
  });
  
  var rightlegendTitle = ui.Label({
    value: 'Estimated Damage',
    style: {
      fontWeight: 'bold',
      fontSize: '13px',
      margin: '0 8px 0 0',
      padding: '0'
    }
  });
  
  var rightlegendColors = ui.Thumbnail({
    image: ee.Image.pixelLonLat().select(0),
    params: {
      bbox: [0, 0, 1, 0.1],
      dimensions: '100x10',
      format: 'png',
      min: 0,
      max: 1,
      palette: palette,
    },
    style: {stretch: 'horizontal', margin: '0px 15px', maxHeight: '12px'},
  });
  
  var rightmaxmin = ui.Panel({
    widgets: [
      ui.Label(palette[0]),
      ui.Label(palette[palette.length - 1], {textAlign: 'right'})
    ],
    layout: ui.Panel.Layout.flow('horizontal')
  });
  
  right_legend_Panel.add(rightlegendTitle);
  right_legend_Panel.add(rightlegendColors);
  right_legend_Panel.add(rightmaxmin);
  
  rightMap.add(right_legend_Panel);
  