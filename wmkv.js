/**
 * Wmkv Class
 *
 * @param Values {Class} Array like class to store data, e.g. typed array; default: Array
 */
var Wmkv = module.exports = function(Values) {
  if (!Values) {
    Values = Array;
  }
  if (! (this instanceof Wmkv)) { // enforcing new
    return new Wmkv(Values);
  }
  this._Values = Values;
  this._kv = {};
  // {
  //  1d: new this._Values(), // data indexed by the position of the key
  //  1m: typed array, // wavelet matrix
  //  2d: ...,
  //  2m: ...,
  //  ...
};

Wmkv.prototype._append = function(key, val) {
  var l = key.length;
  var d = l + 'd';
  var m = l + 'm';
  var _kv = this._kv;
  var vals = _kv[d];
  var pos = vals.length;
  vals[pos] = val;
  var wm = _kv[m];
  wm[pos] = new Buffer(key); // TODO
};

Wmkv.prototype._rank = function() {
  // TODO
};

Wmkv.prototype._select = function(key) {
  // TODO
};

Wmkv.prototype.get = function(key) {
  var l = key.length;
  var d = l + 'd';
  var m = l + 'm';
  var _kv = this._kv;
  var pos = this._select(key);
  return (pos--) ? _kv[d][pos] : undefined;
};

Wmkv.prototype.set = function(key, val) {
  var l = key.length;
  var d = l + 'd';
  var m = l + 'm';
  var _kv = this._kv;
  if (!_kv.hasOwnProperty(d)) {
    _kv[d] = new this._Values();
    _kv[m] = []; // row: key, col: bits
  }
  var pos = this._select(key);
  if (pos--) {
    _kv[d][pos] = val;
  } else {
    this._append(key, val);
  }
};

Wmkv.prototype.del = function(key) {
  // TODO
};

Wmkv.prototype.serialize = function() {
  // TODO
};

Wmkv.prototype.deserialize = function() {
  // TODO
};

