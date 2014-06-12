var config = require('./config');
var amqp = require('amqp');
var conn = amqp.createConnection({ host: config.amqp.host });
var client = require('../lib/clients');

conn.on('ready', function(){
  conn.exchange('hutch', {type: 'topic', autoDelete: false, durable: true}, function(exchange){
    conn.queue('flume_create', {durable: true}, function(queue){
      queue.bind(exchange, 'ps.flume.client.create');
      queue.subscribe(function (message, headers, deliveryInfo) {
        client.create(message.unique_id, message.meraki_validator, message.meraki_secret, function(client) {
          console.log("created client: " + client.unique_id)
          if ( client != false ) {
            exchange.publish("ps.location.sense.enabled", { slug: message.slug, type: 'created' });
          }
          else {
            exchange.publish("ps.location.sense.error", { slug: message.slug, type: 'created_issue' });
          }
        })
      });
    });

    conn.queue('flume_delete', {durable: true}, function(queue){
      queue.bind(exchange, 'ps.flume.client.delete');
      queue.subscribe(function (message, headers, deliveryInfo) {
        client.delete(message.unique_id, function(client) {
          console.log("delete: " + client)
          exchange.publish("ps.location.sense.deleted", { slug: message.slug, type: 'deleted' });
        })
      });
    });

    conn.queue('flume_update', {durable: true}, function(queue){
      queue.bind(exchange, 'ps.flume.client.update');
      queue.subscribe(function (message, headers, deliveryInfo) {
        options = {
          meraki_validator: message.meraki_validator,
          meraki_secret: message.meraki_secret
        }
        client.update(message.unique_id, options, function(client) {
          console.log("updated: " + client)
          exchange.publish("ps.location.sense.updated", { slug: message.slug, type: 'updated' });
        })
      });
    });

    conn.queue('flume_count', {durable: true}, function(queue){
      queue.bind(exchange, 'ps.flume.stream.count');
      queue.subscribe(function (message, headers, deliveryInfo) {
        stream.count(message.meraki_secret, function(count) {
          console.log("status: " + count)
          exchange.publish("ps.location.sense.count", { slug: message.slug, type: 'updated', count: count });
        })
      });
    });
  });
});
