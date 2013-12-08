var Wm = require('./wm');

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
  // {
  //  1: {
  //      'k': val,
  //      ...
  //     },
  //  2: {
  //      'ke': val,
  //      ...
  //     },
  //  3: {
  //      'key': val,
  //      ...
  //     },
  //  ...
  this._maxCacheSize = maxCacheSize || Wm.Bitmap.chunksize;
  this._cacheSize = 0;
};

/**
 * get function
 *
 * @param key {String} key to retrieve
 */
Wmkv.prototype.get = function(key) {
  var l = key.length;
  var cacheKv = this._cacheKv[l];
  if (cacheKv && cacheKv.hasOwnProperty(key)) {
    return cacheKv[key];
  }
  var d = l + 'd';
  var m = l + 'm';
  var _wmkv = this._wmkv;
  var wm = _wmkv[m];
  var pos = wm? wm.select(key) : 0;
  return (pos--) ? _wmkv[d][pos] : undefined;
};

/**
 * set function
 *
 * @param key {String} key to save
 * @param val {String, Object, Number} any value that this._Values can contain
 */
Wmkv.prototype.set = function(key, val) {
  var l = key.length;
  var cacheKv = this._cacheKv[l];
  if (!cacheKv) {
    cacheKv = this._cacheKv[l] = {};
  }
  if (!cacheKv.hasOwnProperty(key)) {
    this._cacheSize += 1;
  }
  cacheKv[key] = val;
  if (this._cacheSize > this._maxCacheSize) {
    this.compaction();
  }
};


/**
 * delete function
 *
 * @param key {String} key to delete
 */
Wmkv.prototype.del = function(key) {
  var l = key.length;
  var cacheKv = this._cacheKv[l];
  if (cacheKv && cacheKv.hasOwnProperty(key)) {
    cacheKv[key] = null;
  }
  // No need to update this._wmkv since the cache keeps key: null
};

/**
 * Move all cache data to the wavelet matrix
 */
Wmkv.prototype.compaction = function() {
  var _cacheKv = this._cacheKv;
  var _wmkv = this._wmkv;
  for (var l in _cacheKv) {
    if (_cacheKv.hasOwnProperty(l)) {
      var cacheKv = _cacheKv[l];
      var d = l + 'd';
      var m = l + 'm';
      if (!_wmkv.hasOwnProperty(m)) {
        _wmkv[d] = new this._Values();
        _wmkv[m] = new Wm(l);
      }
      var wm = _wmkv[m];
      var vals = _wmkv[d];
      var addKeys = [];
      var removeKeys = [];
      for (var key in cacheKv) {
        if (cacheKv.hasOwnProperty(key)) {
          var val = cacheKv[key];
          if (val === null) {
            removeKeys.push(key);
            continue;
          }
          var pos = wm.select(key);
          if (pos--) {
            vals[pos] = val;
          } else {
            addKeys.push(key);
          }
        }
      }
      wm.update(addKeys, removeKeys);
      for (var i = addKeys.length; i--;) {
        var key = addKeys[i];
        var pos = wm.select(key);
        if (pos--) {
          vals[pos] = cacheKv[key];
        } else {
          throw Error('Wow, you cannot reach here!');
        }
      }
    }
  }
  this._cacheKv = {};
  this._cacheSize = 0;
};

/**
 * Serialize to store in DB
 */
Wmkv.prototype.serialize = function() {
  this.compaction();
  // TODO
};

Wmkv.prototype.deserialize = function() {
  // TODO
};

