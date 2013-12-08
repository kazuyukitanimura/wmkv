var Bitmap = require('../bitmap');

/**
 * Population count. Same as Bitmap.prototype.count
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

var RANK_TABLE = new Uint8Array([0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4, 1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5, 1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 4, 5, 5, 6, 5, 6, 6, 7, 5, 6, 6, 7, 6, 7, 7, 8]);
Bitmap.prototype.popCount2 = function() {
  var total = 0;
  var a = this.buffer;
  var bytes = this.bytes;
  for (var i = this.bytes; i--;) {
    total += RANK_TABLE[a[i]];
  }
  return total;
};

Bitmap.chunksize = 1024;
var a = new Buffer(1024);
for (i = 0; i < 1024; i++) {
  a[i] = 1;
}
var b = new Bitmap(a);
var start = 0;
var end = 0;
var i = 0;
var repeat = 10000;

start = Date.now();
for (i = repeat; i--;) {
  b.count();
}
end = Date.now();
console.log('count:', end - start);

start = Date.now();
for (i = repeat; i--;) {
  b.popCount();
}
end = Date.now();
console.log('popCount:', end - start);

start = Date.now();
for (i = repeat; i--;) {
  b.popCount2();
}
end = Date.now();
console.log('popCount2:', end - start);

var test = true;
test = test && b.count() === b.popCount2();
console.log(test);
test = test && b.count() === b.rank(1, 1024*8);
console.log(test);
