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
var url = require('url');
var mongo = require('mongodb');
var status;
var db;

var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;

if(process.env.MONGOHQ_URL) {
  MongoClient.connect(process.env.MONGOHQ_URL, function(err, db) {
    // MongoClient.connect("mongodb://heroku:6b3c2645aa297908264523a982076446@lennon.mongohq.com:10071/app27828396", function(err, db) {
      if(err) throw err;
      db = db;
      status = db.collection('status');
  })
} else {
  MongoClient.connect('mongodb://127.0.0.1/health', function(err, db) {
      if(err) throw err;
      db = db;
      status = db.collection('status');
  })
}

app.get('/api/v1/health', function(req, res) {
  console.log(process.env)
  status.find({}).limit(1).sort({created_at: -1}).toArray(function(err, docs) {
    // res.status(docs[0].code);
    res.json(JSON.stringify({message: 'docs'}));
  })
});


app.post('/api/v1/health', function(req, res) {
  var url_parts = url.parse(req.url, true);
  var msg = url_parts.query.message
  var code = url_parts.query.code
  if (url_parts.query.auth == 'AAAV5' && code && msg) {
    _createStatus(msg, code, function(callback) {
      res.json(JSON.stringify(callback[0]));
    })
  } else {
    res.status(404)
    res.send({message: "Not found"})
  }
});

var _createStatus = function(message, code, callback) {
  created_at = (new Date).getTime();
  status.insert({
    message: message,
    code: code,
    created_at: created_at
  }, function(err, docs) {
    callback(docs)
  })
}

http.createServer(app).listen(app.get('port'), function() {
  console.log('Server listening on port %d', app.get('port'));
});

