var Bitmap = require( 'persistable-bitmap' );

/**
 * Wavelet Matrix Class
 */
var Wm = function() {

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
  // TODO
};

Wm.prototype.remove = function(key) {
  // TODO
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

Wmkv.prototype._append = function(key, val) {
  var l = key.length;
  var d = l + 'd';
  var m = l + 'm';
  var _wmkv = this._wmkv;
  var vals = _wmkv[d];
  var pos = vals.length;
  vals[pos] = val;
  var wm = _wmkv[m];
  wm.add(key); // TODO
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
    _cacheKv[key] = undefined;
  }
  // No need to update this._wmkv since the cache keeps key: undefined
};

/**
 * Move all cache data to the wavelet matrix
 */
Wmkv.prototype.compaction = function() {
  var l = key.length;
  var d = l + 'd';
  var m = l + 'm';
  var _wmkv = this._wmkv;
  if (!_wmkv.hasOwnProperty(d)) {
    _wmkv[d] = new this._Values();
    _wmkv[m] = []; // row: key, col: bits
  }
  var pos = this._select(key);
  if (pos--) {
    _wmkv[d][pos] = val;
  } else {
    this._append(key, val);
  }
  // TODO
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

