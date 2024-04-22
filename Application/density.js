
var feature = ningxia.first(); 

feature.propertyNames().evaluate(function(names) {
  print('name:', names);
});

ningxia.evaluate(function (result) {
  if (result.features) {
    var names = result.features.map(function (feature) {
      return feature.properties.Name; 
    });
    print('region:', names);

    
    result.features.forEach(function (feature) {
      var area = ee.Feature(feature).area(); 
      print('region', feature.properties.Name, 'areas', area);
    });
  } else {
    print('error');
  }
});



var pvArea = {
  'Yinchuan': [53.42, 52.96, 55.73, 69.53, 95.53], 
  'Wuzhong': [33.84, 32.22, 47.29, 49.81, 67.66],
  'Zhongwei': [52.69, 61.55, 52.60, 63.04, 56.61],
  'Guyuan': [0, 0, 0, 0, 0], 
  'Shishanzui': [21.98, 27.18, 34.89, 32.57, 31.03]
};


var totalArea = {
  'Yinchuan': 6762198507.325334,
  'Wuzhong': 16912522299.84439,
  'Zhongwei': 13639676039.99642,
  'Guyuan': 10523473172.339647, 
  'Shishanzui': 4079000561.3583436
};




var years = [2019, 2020, 2021, 2022, 2023];

// calculate density
var density = {};
Object.keys(pvArea).forEach(function(region) {
  density[region] = {};
  pvArea[region].forEach(function(area, index) {
    density[region][years[index]] = area / totalArea[region]; 
  });
});

print('density', density);