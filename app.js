var util = require( 'util' );
var mongoose = require('mongoose');
var journey = require('journey');
var winston = require('winston');
var https = require('https');
var fs = require('fs');
var options = {
  key: fs.readFileSync('./ssl/cert.key'),
  cert: fs.readFileSync('./ssl/cert.pem'),
};



winston.log('info', 'Hello world');

var logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
    handleExceptions: true,
    json: true
  })
  ],
  exitOnError: false
});


mongoose.connect('mongodb://localhost/flume');

var Stream = mongoose.model('Stream', {
  ap_mac: String,
  rssi: Number,
  last_seen: Date,
  is_associated: Boolean,
  client_mac: String,
  meraki_secret: String,
  created_at: String
});

var Clients = mongoose.model('Clients', {
  unique_id: String,
  meraki_secret: String,
  meraki_validator: String,
  created_at: String
});

var router = new(journey.Router);

router.map(function () {
  this.root.bind(function (req, res) {
    res.send(200, {}, {message:"I'm doing it with Tony, are you?"});
  });

  this.get("/api/v1/flume").bind(function (req, res, params) {
    console.log(req)
    Clients.findOne({ unique_id: params.id }, 'meraki_validator', function (err, client) {
      if (err == null && client != null) {
        res.send(200, {}, client.meraki_validator); // PS HQ
      }
      else { res.send(404); }
    });
  });

  this.post("/api/v1/flume").bind(function (req, res, params, id, data) {
    console.log(params);
    Clients.findOne({ unique_id: params.id }, 'meraki_secret', function (err, client) {
      if (err == null && client) {
        array = JSON.parse(params.data);
        if (array.secret == client.meraki_secret) {
          processData(array);
          res.send(200);
        }
      }
      else { res.send(404); }
    });
  });
});

function processData(data) {
  console.log("processing...");

  secret = data.secret;
  created_at = (new Date).getTime();

  for(var i = 0; i < data.probing.length; i++) {
    var obj = data.probing[i];

    var stream = new Stream( {
      ap_mac: obj.ap_mac,
      rssi: obj.rssi,
      is_associated: obj.is_associated,
      client_mac: obj.client_mac,
      last_seen: obj.last_seen,
      meraki_secret: secret,
      created_at: created_at
    });

    stream.save(function (err) {
      // if (err) {
      //   console.log(err);
      // }
      // else { console.log(123123123123123); }
    });
  }
}

require('http').createServer(function (request, response) {
  var body = "";

  request.addListener('data', function (chunk) { body += chunk });
  request.addListener('end', function () {

    router.handle(request, body, function (result) {
      response.writeHead(result.status, result.headers);
      response.end(result.body);
    });
  });
}).listen(8000);

https.createServer(options,function (request, response) {

  var body = "";

  request.addListener('data', function (chunk) { body += chunk });
  request.addListener('end', function () {

    router.handle(request, body, function (result) {
      response.writeHead(result.status, result.headers);
      response.end(result.body);
    });
  });
}).listen(8443);
