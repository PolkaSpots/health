var config = require('../lib/config');
var url = require('url');
var client = require('../lib/clients');
var stream = require('../lib/streams');
var amqp = require('amqp');
var conn = amqp.createConnection({ host: config.amqp.host });
var queue = require('../lib/queue')


exports.index = function(req,res) {
  res.json(JSON.stringify({message: "Phone home"}));
};

exports.get_flume = function(req, res) {
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  client.findByUniqueId(query.id, function (client) {
    if (client == false) {
      res.send(404)
    }
    else {
      res.send(client.meraki_validator); // PS HQ
    }
  });
}

exports.temp = function(req, res) {

  queue.publish(123)
  res.send(200)


}

exports.post_flume = function(req, res) {
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  console.log("Processing...")
  client.getSecret(query.id, function(secret) {
    if (secret == false) {
      res.send(404)
    }
    else {
      array = JSON.parse(req.body.data);
      if (array.secret == secret) {
        console.log("Post req, secret matches")
        queue.publish(array, function() {});
        // stream.batchCreate(array, function() {})
      }
      res.send(200);
    }
  })
}
