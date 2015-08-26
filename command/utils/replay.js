var Q  = require('q');
// replayer(sessionId, new session.Replayer, "session")
function replayer(db, viewName, replayerConstructor) {
    return function(id) {
        var replayer = new replayerConstructor();
        var deferred = Q.defer();
        db.view(viewName, "event_log", {"key": id}, function(err, body){
            console.log("REPLAYING from "+viewName+"'s event_log, keyed by "+id);
            if (err) {
                console.warn("-- Error: ",err);
                deferred.reject(err);
            } else {
                console.log("-- There are "+body.rows.length+" events");
                body.rows.forEach(function(row) {
                    var event = row.value;
                    console.log("ROW: ", row);
                    console.log("EVENT: ", event);
                    console.log("Replay: ."+event.event+"(",event.value,")");
                    if (replayer[event.event]) {
                        replayer[event.event](event.value);
                    }
                });
                console.log("--- Finishing");
                deferred.resolve(replayer.state);
            }
            //yield workout;
        });
        return deferred.promise;
    }; 
}

module.exports = replayer