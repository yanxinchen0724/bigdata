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