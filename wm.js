var Bitmap = require('persistable-bitmap');

/**
 * Wavelet Matrix Class
 *
 * @param keyLength {Number} the length of keys in byte
 */
var Wm = module.exports = function(keyLength) {
  if (!keyLength) {
    throw Error('invalid keyLength');
  }
  if (! (this instanceof Wm)) { // enforcing new
    return new Wm(keyLength);
  }
  this.keyLength = keyLength;
  this.length = 0;
  var _matrix = this._matrix = new Array(keyLength * 8); // row: bits, col: key
  for (var i = _matrix.length; i--;) {
    _matrix[i] = new Bitmap(null);
  }
};

Wm.prototype.rank = function() {
  // TODO
};

Wm.prototype.select = function(key) {
  // TODO
};

/**
 * Update the wavelet matrix given keys to add and remove
 *
 * @param addKeys {Array} keys to add
 * @param removeKeys {Array} keys to remove
 */
Wm.prototype.update = function(addKeys, removeKeys) {
  if (!addKeys) {
    addKeys = [];
  } else if (!Array.isArray(addKeys)) {
    addKeys = [addKeys];
  }
  if (!removeKeys) {
    removeKeys = [];
  } else if (!Array.isArray(removeKeys)) {
    removeKeys = [removeKeys];
  }
  this.length += addKeys.length - removeKeys.length;
  // TODO
};

Bitmap.chunksize = 1024;
Wm.Bitmap = Bitmap;
