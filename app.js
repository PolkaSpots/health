var express = require('express')
  , http = require('http')
  , https = require('https')
  , app = express();

app.configure(function() {
  app.set('port', process.env.PORT || 8000);
  app.set('ssl_port', process.env.SSL_PORT || 8443);
  app.use(express.logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.methodOverride());
});

var routes = require('./routes/')
var util = require( 'util' );

app.get('/api/v1/health', routes.index)

http.createServer(app).listen(app.get('port'), function() {
  console.log('Server listening on port %d', app.get('port'));
});

