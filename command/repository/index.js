module.exports = function(cache, replayer) {
 return function(id) {
  console.log("Looking in cache for "+id+"...", cache);
  return cache.get(id).fail(function() {
    console.log("cache did not have "+id+", replaying...");
    return replayer(id).then(function(model) {
      console.log("storing obj from replay in cache", id, model);
      return cache.put(id,model);
    }, function(err) {
      console.warn("Cache and replayer failure for id ", id);
      throw err;  
    });
  });
 };
};



// function firstFound(lookupChain) {
//   return {
//      get: function(id) {
//       return chain.reduce(function(acc, store){
//         return acc || store.get(id);
//       });
//     }
//   }
// }

// -------------------- TODO test this crap.. 
// function firstFoundBackFill(lookupChain) {
//   return function(id) {
//     chunked(lookupChain, 2).reduce(function(value, pair){
//       return value || get(id).apply(this, pair);
//     }, null)
//   }
// }

// function chunked(list, byCount) {
//   var retval = [];
//   for (var i = 0; i < list.length; i++) {
//     var group = list.slice(i, byCount);
//     console.log(i, list.length, byCount, group);
//     if (group.length != byCount) break;
//     retval.push(group);
//   }
//   return retval;
// }

// function get(id) {
//   function storeNext(store, next) {
//       var obj = next.get(id);
//       return store.put(id, obj);
//   }
//   return function(store, next) {
//     return store.get(id) || storeNext(store, next);
//   }
// }



// function InMemory() {
//   var self = this;
//   self._cache = {};
//   self.get = function(id) {
//     return self._cache[id];
//   };
//   self.put = function(id, obj) {
//     self._cache[id] = obj;
//     return obj;
//   };
// };

// var cache = new InMemory();
// var store = new InMemory();