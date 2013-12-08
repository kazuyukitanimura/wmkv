var Bitmap = require('./bitmap');

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

Wm.prototype.rank = function(key) {
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
  var i = 0;
  var key = '';
  for (i = removeKeys.length; i--;) {
    key = removeKeys[i];
  }
  for (i = addKeys.length; i--;) {
    key = removeKeys[i];

  }
  this.length += addKeys.length - removeKeys.length; // FIXME removeKeys may contain keys that do not exist
};

Bitmap.chunksize = 1024;
Wm.Bitmap = Bitmap;

