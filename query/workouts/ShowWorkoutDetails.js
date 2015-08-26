var Workout = require('../../command/model/workout'),
    Q = require('q');

function ShowWorkoutDetails(db) {
    return function (workoutId) {
        var replayer = new Workout.Replayer();
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
    };
}

module.exports = ShowWorkoutDetails;