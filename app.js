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
var config = require('./lib/config');
var mongoose = require('mongoose');

var fs = require('fs');

var options = {
  key: fs.readFileSync('./ssl/cert.key'),
  cert: fs.readFileSync('./ssl/cert.pem'),
};

mongoose.connect(config.db.mongodb);

app.get('/', routes.index)
app.get('/api/v1/flume', routes.get_flume)
app.post('/api/v1/flume', routes.post_flume)
app.get('/api/v1/temp', routes.temp)

var amqp = require("./lib/amqp")

// https.createServer(options, app).listen(app.get("ssl_port"), function() {
//   console.log('SSL Server listening on port %d', app.get('ssl_port'));
// })

http.createServer(app).listen(app.get('port'), function() {
  console.log('Server listening on port %d', app.get('port'));
});

