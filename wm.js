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
  this._bounaries = new Uint32Array(keyLength * 8);
};

/**
 * Count the occurance of key
 *
 * @param key {String} key to count
 * @param pos {Number} position starting from 0
 */
Wm.prototype.rank = function(key, pos) {
  var keyLength = this.keyLength;
  if (key.length !== keyLength) {
    throw new Error('Invalid key');
  }
  var _matrix = this._matrix;
  var _bounaries = this._bounaries;
  var bits = new Bitmap(new Buffer(key));
  var bitsL = keyLength * 8;
  var bit = bits.get(0);
  var oldBit = 0;
  var bound = 0;
  var range = new Uint32Array([0, pos || this.length]);
  pos = _matrix[0].rank(bit, range);
  for (var i = 1; i < bitsL; i++) {
    bound = _bounaries[i];
    if (!(bit | oldBit)) {
      range[1] = range[0] + pos;
    } else if (bit & oldBit) {
      range[0] = range[1] - pos;
    } else {
      range[1] = bound + pos * bit;
      range[0] = bound - pos * oldBit;
    }
    oldBit = bit;
    bit = bits.get(i);
    pos = _matrix[i].rank(bit, range);
  }
  return pos;
};

/**
 * Find the position of key
 *
 * @param key {String} key to count
 * @param ind {Number} position starting from 0
 */
Wm.prototype.select = function(key, ind) {
  var keyLength = this.keyLength;
  if (key.length !== keyLength) {
    throw new Error('Invalid key');
  }
  var _matrix = this._matrix;
  var _bounaries = this._bounaries;
  var bits = new Bitmap(new Buffer(key));
  var bitsL = keyLength * 8;
  var i = bitsL - 1;
  var bit = bits.get(i);
  var oldBit = 0;
  var bound = _bounaries[i];
  ind = ind | 0;
  var range = new Uint32Array([0, this.length]);
  for (; i--;) {
    oldBit = bit;
    bit = bits.get(i);
    if (!(bit | oldBit)) {
      range[1] = range[0] + ind;
    } else if (bit & oldBit) {
      range[0] = range[1] - ind;
    } else {
      range[1] = bound + ind * bit;
      range[0] = bound - ind * oldBit;
    }
    ind = _matrix[i].select(bit, range);
    bound = _bounaries[i];
  }
  return ind;
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

