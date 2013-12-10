var Bitmap = require('./bitmap');

/**
 * Wavelet Matrix Class
 *
 * @param keyLength {Number} the length of keys in byte
 */
var Wm = module.exports = function(keyLength) {
  if (!keyLength) {
    throw new Error('Invalid keyLength');
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

/**
 * Find the position of key
 *
 * @param key {String} key to find
 */
Wm.prototype.find = function(key) {
  var keyLength = this.keyLength;
  if (key.length !== keyLength) {
    throw new Error('Invalid key');
  }
  var _matrix = this._matrix;
  var bitsL = keyLength * 8;
  var lo = 0;
  var hi = this.length;
  var bit = (key.charCodeAt(0) >> 7) & 1;
  var rank = _matrix[0].rank(bit, lo, hi);
  var select = _matrix[0].select(bit, 0, 0);
  var firstBit = bit;
  var i = 1;
  for (; i < bitsL && rank; i++) {
    var ind = lo;
    if (bit) {
      lo = hi - rank;
      ind = lo - ind;
    } else {
      hi = lo + rank;
    }
    bit = (key.charCodeAt(i >> 3) >> (~i & 0x07)) & 1;
    rank = _matrix[i].rank(bit, lo, hi);
    if (ind) {
      select = _matrix[0].select(firstBit, select, ind);
    }
  }
  if (!rank) {
    return -1;
  } else if (rank !== 1) {
    throw new Error('Multiple key entries are found');
  }
  return select;
};

/**
 * Merge the current _matrix with a newMatrix recursively
 */
Wm.prototype._merge = function(newMatrix, length) {
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
  var j = 0;
  var key = '';
  var keyLength = this.keyLength;
  var bitsL = keyLength * 8;
  // create a new matrix first and merge with the existing one later
  var newMatrix = new Array(keyLength * 8);
  for (i = newMatrix.length; i--;) {
    newMatrix[i] = new Bitmap(null);
  }
  // TODO support remove later
  //for (i = removeKeys.length; i--;) {
  //  key = removeKeys[i];
  //}
  for (i = 0; i < bitsL; i++) {
    for (j = addKeys.length; j--;) { // FIXME for now we do not check repeated/existing keys
      key = removeKeys[j];
      bit = (key.charCodeAt(i >> 3) >> (~i & 0x07)) & 1;
      if (bit) {
        newMatrix[i].set(j);
      }
    }
  }
  this._merge(newMatrix, addKeys.length);
  // merge step
  this.length += addKeys.length - removeKeys.length; // FIXME removeKeys may contain keys that do not exist
};

Bitmap.chunksize = 256;
Wm.Bitmap = Bitmap;

