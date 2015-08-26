
module.exports = self = {

 firstFound: function(lookupChain) {
   return {
      get: function(id) {
       return chain.reduce(function(acc, store){
         return acc || store.get(id);
       });
     }
   };
 },

firstFoundBackFill: function(lookupChain) {
  function headTail(a) {
    return {head: a[0],
            tail: a.slice(1, a.length)};
  }
  return function(id) {

    var chunks = self.chunked(lookupChain, 2);
    var value = undefined;
    var i = 0;
    var value = undefined;
    for(; i < chunks.length; i++) {
      var group = chunks[i];
      value = self.get(id).apply(this, group);
      if (value) break;
    }
    console.log("found %s in group %d", value, i);
    for(i - 1; i >= 0; i--) {
      lookupChain[i].put(id, value);
    }

    return value;
  };
},

 chunked: function(list, byCount) {
   byCount = byCount || 2;
   var retval = [];
   for (var i = 0; i < list.length; i++) {
     var group = list.slice(i, i+byCount);
     if (group.length != byCount) break;
     retval.push(group);
   }
   return retval;
 },

 get: function(id) {
   function storeNext(store, next) {
       var obj = next.get(id);
       return store.put(id, obj);
   }
   return function(store, next) {
     return store.get(id) || storeNext(store, next);
   };
 }
};

