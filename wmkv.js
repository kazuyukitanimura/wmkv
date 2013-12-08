var Bitmap = require('persistable-bitmap');

/**
 * Wavelet Matrix Class
 */
var Wm = function(keyLength) {
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

Wm.prototype.add = function(keys) {
  if (!Array.isArray(keys)) {
    keys = [keys];
  }
  this.length += keys.length;
  // TODO
};

Wm.prototype.remove = function(key) {
  var pos = this.select(key);
  if (pos) {
    // TODO
  }
};

/**
 * Wmkv Class
 *
 * @param Values {Class} Array like class to store data, e.g. typed array; default: Array
 * @param maxCacheSize {Number} if the number of entries exceed the maxCacheSize, recreate the wavelet matrix; default: 1024
 */
var Wmkv = module.exports = function(Values, maxCacheSize) {
  if (! (this instanceof Wmkv)) { // enforcing new
    return new Wmkv(Values, maxCacheSize);
  }
  this._Values = Values || Array;
  this._wmkv = {};
  // {
  //  1d: new this._Values(), // data indexed by the position of the key
  //  1m: typed array, // wavelet matrix
  //  2d: ...,
  //  2m: ...,
  //  ...
  this._cacheKv = {}; // cache key value
  this._maxCacheSize = maxCacheSize || 1024;
  this._cacheSize = 0;
};

Wmkv.prototype.get = function(key) {
  var _cacheKv = this._cacheKv;
  if (_cacheKv.hasOwnProperty(key)) {
    return _cacheKv[key];
  }
  var l = key.length;
  var d = l + 'd';
  var m = l + 'm';
  var _wmkv = this._wmkv;
  var pos = _wmkv[m].select(key);
  return (pos--) ? _wmkv[d][pos] : undefined;
};

Wmkv.prototype.set = function(key, val) {
  var _cacheKv = this._cacheKv;
  if (!_cacheKv.hasOwnProperty(key)) {
    this._cacheSize += 1;
  }
  _cacheKv[key] = val;
  if (this._cacheSize > this._maxCacheSize) {
    this.compaction();
  }
};

Wmkv.prototype.del = function(key) {
  var _cacheKv = this._cacheKv;
  if (_cacheKv.hasOwnProperty(key)) {
    _cacheKv[key] = null;
  }
  // No need to update this._wmkv since the cache keeps key: null
};

/**
 * Move all cache data to the wavelet matrix
 */
Wmkv.prototype.compaction = function() {
  var _cacheKv = this._cacheKv;
  var _wmkv = this._wmkv;
  for (var key in _cacheKv) {
    if (_cacheKv.hasOwnProperty(key)) {
      var val = _cacheKv[key];
      var l = key.length;
      var d = l + 'd';
      var m = l + 'm';
      if (!_wmkv.hasOwnProperty(d)) {
        _wmkv[d] = new this._Values();
        _wmkv[m] = new Wm(l);
      }
      var wm = _wmkv[m];
      if (val === null) {
        wm.remove(key);
        continue;
      }
      var pos = wm.select(key);
      if (pos--) {
        _wmkv[d][pos] = val;
      } else {
        var vals = _wmkv[d];
        pos = wm.length;
        vals[pos] = val;
        _wmkv[m].add(key);
      }
    }
  }
  this._cacheKv = {};
  this._cacheSize = 0;
};

Wmkv.prototype.serialize = function() {
  this.compaction();
  // TODO
};

Wmkv.prototype.deserialize = function() {
  // TODO
};

