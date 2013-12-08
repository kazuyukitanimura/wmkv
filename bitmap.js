var Bitmap = module.exports = require('persistable-bitmap');

/**
 * Count 1 bits between [0...pos)
 */
Bitmap.prototype.rank = function(b, pos) {
  var oldBytes = this.bytes;
  var bytes = this.bytes = pos / 8 | 0;
  var total = this.count();
  this.bytes = oldBytes;
  var rem = pos - bytes * 8;
  var w = this.buffer[bytes + 1];
  if (w) {
    w = w >> (8 - rem);
    w = ((w & 0xaa) >>> 1) + (w & 0x55);
    w = ((w & 0xcc) >>> 2) + (w & 0x33);
    total += ((w & 0xf0) >>> 4) + (w & 0x0f);
  }
  return b ? total: pos - total;
};

/**
 * Position (ind + 1)th b bit
 */
Bitmap.prototype.select = function(b, ind) {
  // TODO
};

