//Calculate density
ee.FeatureCollection("projects/solarstationinspection/assets/Ningxia_District");
var feature = ningxia.first(); 

// Print out the names of all properties
feature.propertyNames().evaluate(function(names) {
  print('Property name:', names);
});

// Print out the Name attribute of all features
ningxia.evaluate(function (result) {
  if (result.features) {
    var names = result.features.map(function (feature) {
      return feature.properties.Name; 
    });
    print('All administrative district names:', names);

    // Calculate the area of each administrative district
    result.features.forEach(function (feature) {
      var area = ee.Feature(feature).area(); 
      print('administrative district', feature.properties.Name, 'The area is:', area);
    });
  } else {
    print('Unable to get administrative district name');
  }
});


//Calculate density
// Define photovoltaic area per district per year
var pvArea = {
  'Yinchuan': [53.42, 52.96, 55.73, 69.53, 95.53], 
  'Wuzhong': [33.84, 32.22, 47.29, 49.81, 67.66],
  'Zhongwei': [52.69, 61.55, 52.60, 63.04, 56.61],
  'Guyuan': [0, 0, 0, 0, 0], 
  'Shishanzui': [21.98, 27.18, 34.89, 32.57, 31.03]
};

// The total area of each district
var totalArea = {
  'Yinchuan': 6762198507.325334,
  'Wuzhong': 16912522299.84439,
  'Zhongwei': 13639676039.99642,
  'Guyuan': 10523473172.339647, 
  'Shishanzui': 4079000561.3583436
};



// Define year array
var years = [2019, 2020, 2021, 2022, 2023];

// Calculate photovoltaic density per district per year
var density = {};
Object.keys(pvArea).forEach(function(region) {
  density[region] = {};
  pvArea[region].forEach(function(area, index) {
    density[region][years[index]] = area / totalArea[region]; 
  });
});

// Print the photovoltaic density per district per year
print('Photovoltaic density per district per year:', density);