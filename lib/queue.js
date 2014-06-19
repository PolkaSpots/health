var Queue = function(){

  var config = require('./config');
  var amqp = require('amqp');
  var conn = amqp.createConnection({ host: config.amqp.host });

  conn.on('ready', function(){})

  var _publish = function(options, callback){
    conn.exchange('hutch', {type: 'topic', autoDelete: false, durable: true}, function(exchange){
      exchange.publish("ps.flume.publish", options );
    })
  }

  var _index = function(options, callback) {
    console.log(options)
    conn.exchange('hutch', {type: 'topic', autoDelete: false, durable: true}, function(exchange){
      exchange.publish("ps.flume.index", options );
    })
  }

  return {
    publish           : _publish,
    index             : _index,
  }
}();

module.exports = Queue;
