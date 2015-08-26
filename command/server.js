var koa  = require('koa'),
    nano = require('nano')('http://192.168.1.148:5984'),
    parse= require('koa-body-parser'),
    static= require('koa-static')
    ;

var recordCommand = require('./handlers/records')(nano.use('records'));

var commandApp = koa();

commandApp.use(parse())

commandApp.use(function *(next) {
  var start = new Date;
  yield next;
  var ms = new Date - start;
  if ('test' != process.env.NODE_ENV) {
    console.log('%s %s %s - %sms', this.host, this.method, this.url, ms);
  }
});


//record stuff
commandApp.use(function* recording(next) {
  if (this.method != 'POST' || this.path.indexOf("/record") != 0 ) return yield next;

  var body = this.request.body; 
  
  var id = recordCommand.recordSession(body);

  this.status = 202;
  this.body = '';
});

commandApp.use(static('static'))

module.exports = {
  app: commandApp,
  recordEvents: recordCommand
}
