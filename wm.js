var Bitmap = require('persistable-bitmap');

/**
 * Wavelet Matrix Class
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
  // row: key, col: bits
  // TODO
};

Wm.prototype.rank = function() {
  // TODO
};

Wm.prototype.select = function(key) {
  // TODO
};

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

