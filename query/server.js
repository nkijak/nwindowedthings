var koa  = require('koa'),
    nano = require('nano')('http://couchdb:5984'),
    parse= require('koa-body-parser')
    ;

var showWorkoutDetails = require('./workouts/ShowWorkoutDetails')(nano.use('workouts'));

var queryApp = koa();

queryApp.use(parse())

queryApp.use(function *(next) {
  var start = new Date;
  yield next;
  var ms = new Date - start;
  if ('test' != process.env.NODE_ENV) {
    console.log('%s %s %s - %sms', this.host, this.method, this.url, ms);
  }
});


//show workout
queryApp.use(function* exercises(next) {
  if (this.method != 'GET' || this.path.indexOf("/workout") != 0 ) return yield next;

  var body = this.request.body; 
  var match = /^\/workout\/([\w-]+)/.exec(this.path)

  if (match) {
    console.log("Looking up workout "+match[1]);
    var workout = yield showWorkoutDetails(match[1])
    if (workout) {
      this.body = workout;
      this.status = 200;
    } else {
      this.throw(404);
    }
  } else {
    this.throw(404);
  } 

});

module.exports = {
  app: queryApp
}
