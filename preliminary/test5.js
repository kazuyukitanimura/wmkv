var Bitmap = require('persistable-bitmap');

/**
 * Population count. Same as Bitmap.prototype.count but more efficient
 */
Bitmap.prototype.popCount = function() {
  var count = 0;
  var bytes = this.bytes;
  var units = bytes / 4 | 0;
  var buf = this.buffer;
  var v = 0;
  for (var i = units; i--;) {
    v = buf.readUInt32BE(i * 4, true);
    v = v - ((v >>> 1) & 0x55555555);
    v = (v & 0x33333333) + ((v >>> 2) & 0x33333333);
    count += ((v + (v >>> 4) & 0xF0F0F0F) * 0x1010101) >>> 24;
  }
  var rem = bytes - units * 4;
  var shift = (4 - rem) * 8;
  v = buf.readUInt32BE(units * 4, true) >> shift;
  v = v - ((v >>> 1) & 0x55555555);
  v = (v & 0x33333333) + ((v >>> 2) & 0x33333333);
  count += ((v + (v >>> 4) & 0xF0F0F0F) * 0x1010101) >>> 24;
  return count;
};

Bitmap.chunksize = 1024;
var b = new Bitmap(null);
var start = 0;
var end = 0;
var i = 0;
var repeat = 10000;

start = Date.now();
for (i = repeat; i--;) {
  b.count();
};
end = Date.now();
console.log('count:', end - start);

start = Date.now();
for (i = repeat; i--;) {
  b.popCount();
};
end = Date.now();
console.log('popCount:', end - start);
