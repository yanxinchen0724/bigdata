// -------------------Create two separate map panels-------------------
var leftMap = ui.Map();
var rightMap = ui.Map();

ui.root.clear();

// Create the left map panel
var leftPanel = ui.Panel({
  widgets: [leftMap],
  layout: ui.Panel.Layout.flow('vertical'),
  style: {stretch: 'both'}
});

// Create the right map panel
var rightPanel = ui.Panel({
widgets: [rightMap],
  layout: ui.Panel.Layout.flow('vertical'),
  style: {stretch: 'both'}
});

// Add left and right map panels to the root panel
ui.root.add(leftPanel);
ui.root.add(rightPanel);

// Set the left and right maps to display the same area
var xinjiang = ee.FeatureCollection("projects/ee-ucfnfou/assets/ningxia");
leftMap.centerObject(xinjiang, 5);
rightMap.centerObject(xinjiang, 5);

// Set control display, allowing users to control the visibility of layers
leftMap.setControlVisibility({all: false, zoomControl: false, layerList: false});
rightMap.setControlVisibility({all: false, zoomControl: false, layerList: false});


//-----------------------------Left map configuration---------------------------------------
//-----------------Year-------------
var left_year_Panel = ui.Panel({
  style: {
    position: 'top-left',
    padding: '8px 15px'
  }
});

var leftyearSelectLabel = ui.Label('Select year：');
var leftyearSelect = ui.Select({
  items: ['2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
  placeholder: 'Select year',
  onChange: function(year) {
    loadLeftMapWithYear(year);
  }
});

// Combination panel
left_year_Panel.add(leftyearSelectLabel);
left_year_Panel.add(leftyearSelect);
leftPanel.add(left_year_Panel); 


//-----------------Layers
var left_layer_Panel = ui.Panel({
  style: {
    position: 'top-left',
    padding: '8px 15px'
  }
});

var leftlayerSelectLabel = ui.Label('Select layer：');
var leftlayerSelect = ui.Select({
  items: ['image1', 'image2', 'image3'],
  placeholder: 'Select layer',
  onChange: function(layer) {
    loadLeftMapWithLayer(layer);
  }
});

// Create a layer selection panel
var leftlayerSelectPanel = ui.Panel({
  widgets: [leftlayerSelectLabel, leftlayerSelect],
  layout: ui.Panel.Layout.flow('vertical'),
  style: {stretch: 'horizontal'}
});

// Combination panel
left_layer_Panel.add(leftlayerSelectLabel);
left_layer_Panel.add(leftlayerSelect);
leftPanel.add(left_layer_Panel); 


//-----------------legend
var left_legend_Panel = ui.Panel({
  style: {
    position: 'bottom-left',
    padding: '8px 15px',
    width: '300px', 
  }
});

var leftlegendTitle = ui.Label({
  value: 'Estimated Damage',
  style: {
    fontWeight: 'bold',
    fontSize: '18px',
    margin: '0 8pxpx 0 0',
    padding: '0'
    }
});


var palette =['#ffffb2', '#fed976', '#feb24c', '#fd8d3c', '#f03b20', '#bd0026'];

var leftlegendColors = ui.Thumbnail({
  image: ee.Image.pixelLonLat().select(0),
  params: {
    bbox: [0, 0, 1, 0.1],
    dimensions: '50x10',
    format: 'png',
    min: 0,
    max: 1,
    palette: palette,
  },
  style: {stretch: 'horizontal', margin: '0px 10px', maxHeight: '15px'},
});

// Create minimum and maximum labels
var leftpanel = ui.Panel({
  widgets: [
    ui.Label(palette[0]),
    ui.Label(palette[palette.length - 1], {textAlign: 'right'})
  ],
  layout: ui.Panel.Layout.flow('horizontal')
});

// Combined legend panel
left_legend_Panel.add(leftlegendTitle);
left_legend_Panel.add(leftlegendColors);
leftPanel.add(left_legend_Panel); 
//------------------------------------------------------------------------


//-----------------------------Right map configuration ---------------------------------------
//-----------------Year  
//var right_year_Panel = ui.Panel({
  //style: {
  //  position: 'top-right',
   // padding: '8px 15px'
//  }
//});

var right_year_Panel = ui.Panel({
  style: {
    position: 'top-right',
    padding: '8px 15px'
  },
  layout: ui.Panel.Layout.absolute() 
});

var rightyearSelectLabel = ui.Label('Select year：');
var rightyearSelect = ui.Select({
  items: ['2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
  placeholder: 'Select year',
  onChange: function(year) {
    loadRightMapWithYear(year);
  }
});

// Combination panel
right_year_Panel.add(rightyearSelectLabel);
right_year_Panel.add(rightyearSelect);
rightPanel.add(right_year_Panel); 


//-----------------Layer
var right_layer_Panel = ui.Panel({
  style: {
    position: 'top-left',
    padding: '8px 15px'
  }
});

var rightlayerSelectLabel = ui.Label('Select layer：');
var rightlayerSelect = ui.Select({
  items: ['image1', 'image2', 'image3'],
  placeholder: 'Select layer',
  onChange: function(layer) {
    loadRightMapWithLayer(layer);
  }
});

var rightlayerSelectPanel = ui.Panel({
  widgets: [rightlayerSelectLabel, rightlayerSelect],
  layout: ui.Panel.Layout.flow('vertical'),
  style: {stretch: 'horizontal'}
});

// Combination panel
right_layer_Panel.add(rightlayerSelectLabel);
right_layer_Panel.add(rightlayerSelect);
rightPanel.add(right_layer_Panel); 

//-----------------Legend
var right_legend_Panel = ui.Panel({
  style: {
    position: 'bottom-right',
    padding: '8px 15px',
    width: '300px', 
  }
});

var rightlegendTitle = ui.Label({
  value: 'Estimated Damage',
  style: {
    fontWeight: 'bold',
    fontSize: '18px',
    margin: '0 8pxpx 0 0',
    padding: '0'
    }
});

var palette =['#ffffb2', '#fed976', '#feb24c', '#fd8d3c', '#f03b20', '#bd0026'];

var rightlegendColors = ui.Thumbnail({
  image: ee.Image.pixelLonLat().select(0),
  params: {
    bbox: [0, 0, 1, 0.1],
    dimensions: '50x10',
    format: 'png',
    min: 0,
    max: 1,
    palette: palette,
  },
  style: {stretch: 'horizontal', margin: '0px 10px', maxHeight: '15px'},
});

var rightpanel = ui.Panel({
  widgets: [
    ui.Label(palette[0]),
    ui.Label(palette[palette.length - 1], {textAlign: 'right'})
  ],
  layout: ui.Panel.Layout.flow('horizontal')
});

// Combined legend panel
right_legend_Panel.add(rightlegendTitle);
right_legend_Panel.add(rightlegendColors);
rightPanel.add(right_legend_Panel); 
//------------------------------------------------------------------------


//-----------------HOME

// Create a legend panel
var homePanel = ui.Panel({
  style: {
    position: 'top-right',
    padding: '8px 15px',
    width: '10px', 
  }
});

// Create a Home button
var homeButton = ui.Button({
  label: 'Home',
  onClick: function() {
    ui.root.clear();
    ui.root.add(mainPanel);
  }
});

// Combinate Home 
homePanel.add(homeButton);
rightPanel.add(homePanel);