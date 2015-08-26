var http = require('http'),
    idGen = require('./command/utils/idGenerator'),
    commandApp = require('./command/server'),
    queryApp = require('./query/server')
    ;

commandApp.app.listen(3000);
queryApp.app.listen(4000);

