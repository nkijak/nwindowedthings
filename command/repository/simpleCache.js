var Q = require('q');

var SimpleCache = function() {
  var cache = {};
  this.get = function(id) {
    return Q.promise(function(resolve, reject) {
      console.log("SIMPLE_CACHE: LOOKING FOR "+id);
      var obj = cache[id];

      if (obj) { console.log("SIMPLE_CACHE: found "+id, obj); resolve(obj); }
      else { console.log("SIMPLE_CACHE: could not find "+id); reject(); }
    });
  };

  this.put = function(id, obj) {
    console.log("SIMPLE_CACHE: saving "+id, obj);
    return Q.promise(function(resolve, reject) {
      cache[id] = obj;
      resolve(obj);
    });
  };
};

module.exports = SimpleCache;
