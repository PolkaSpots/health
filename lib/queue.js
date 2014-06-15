var Queue = function(){

  var config = require('./config');
  var amqp = require('amqp');
  var conn = amqp.createConnection({ host: config.amqp.host });

  conn.on('ready', function(){})

  var _publish = function(options, callback){
    conn.exchange('hutch', {type: 'topic', autoDelete: false, durable: true}, function(exchange){
      exchange.publish("ps.flume.publish", options );
    })
    console.log("here:" + options)
  }

  return {
    publish           : _publish,
  }
}();

module.exports = Queue;
