var record        = require('../model/record'),
    EventEmitter  = require('events').EventEmitter,
    util          = require('util')
    ;

function RecordHandler(db) {
  var self = this;

  this.recordSession = function(event) {
    console.log(event);
    db.insert(event, function(err, body) {
      if (err) {
        console.warn("Error inserting event", event, err, body);
      } else {
        self.emit("Recorded", event);
      }
    });
    return event;
  };

  this.current = function(user, frame, goal) {
    
      var deferred = Q.defer();
      db.view("workouts", "event_log", {"key": workoutId}, function(err, body){
          if (err) {
              deferred.reject(err);
          } else {
              body.rows.forEach(function(row) {
                  var event = row.value;
                  console.log("ROW: ", row)
                  console.log("EVENT: ", event);
                  console.log("Replay: ."+event.event+"(",event.value,")");
                  if (replayer[event.event]) {
                      replayer[event.event](event.value);
                  }
              });
              var workout = replayer.state;
              deferred.resolve(workout);
          }
          //yield workout;
      });
      return deferred.promise;
  }
}

util.inherits(RecordHandler, EventEmitter);

module.exports = function(db) { return new RecordHandler(db); }

