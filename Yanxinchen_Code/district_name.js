// Get all administrative district names




//'xinjiang' is the variable name for your shapefile feature collection
var feature = ningxia.first(); // Get the first feature from the collection

// Print out all the names of the properties
feature.propertyNames().evaluate(function(names) {
  print('Property names:', names);
});

// Print out the 'Name' property for all features
ningxia.evaluate(function (result) {
  if (result.features) {
    var names = result.features.map(function (feature) {
      return feature.properties.Name; // Ensure the property name matches the actual name in the shapefile
    });
    print('All district names:', names);
  } else {
    print('Unable to retrieve district names');
  }
});
