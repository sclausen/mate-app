// Random float between

rfb = function(minValue, maxValue, precision) {
  if (typeof(precision) == 'undefined') {
    precision = 2;
  }
  return parseFloat(Math.min(minValue + (Math.random() * (maxValue - minValue)), maxValue).toFixed(precision));
}

// Random integer between

rib = function(minValue, maxValue) {
  return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
}