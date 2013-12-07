var util = require('util');

var chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

var cl = chars.length;
var wl = cl + Math.pow(cl, 2) + Math.pow(cl, 3) + Math.pow(cl, 4);
console.log('Words:', wl);

var key = {
  0: '',
  1: '',
  2: '',
  3: ''
};
var dl = 0;
var data = new Float64Array(wl);
var start = Date.now();
for (var i = 0; i < cl; i++) {
  key[0] += chars[i];
  data[dl++] = 1;
  console.log('Memory:', process.memoryUsage().heapUsed / (1024 * 1024), 'M');
}
for (var i = 0; i < cl; i++) {
  for (var j = 0; j < cl; j++) {
    key[1] += chars[i] + chars[j];
    data[dl++] = 1;
  }
  console.log('Memory:', process.memoryUsage().heapUsed / (1024 * 1024), 'M');
}
for (var i = 0; i < cl; i++) {
  for (var j = 0; j < cl; j++) {
    for (var k = 0; k < cl; k++) {
      key[2] += chars[i] + chars[j] + chars[k];
      data[dl++] = 1;
    }
  }
  console.log('Memory:', process.memoryUsage().heapUsed / (1024 * 1024), 'M');
}
for (var i = 0; i < cl; i++) {
  for (var j = 0; j < cl; j++) {
    for (var k = 0; k < cl; k++) {
      for (var l = 0; l < cl; l++) {
        key[3] += chars[i] + chars[j] + chars[k] + chars[l];
        data[dl++] = 1;
      }
    }
  }
  console.log('Memory:', process.memoryUsage().heapUsed / (1024 * 1024), 'M');
}
var elapsed = Date.now() - start;
console.log('Time:', elapsed);
