var Stream = function(){
  var mongoose = require('mongoose');
  var Schema = require('mongoose').Schema;

  var streamSchema = new Schema({
  ap_mac: String,
  rssi: Number,
  last_seen: Date,
  is_associated: Boolean,
  client_mac: String,
  meraki_secret: String,
  created_at: String
  });

  var _model = mongoose.model('Stream', streamSchema);

  var _create = function(options, callback){
    stream = new _model(options);
    stream.save(function (err) {
      if (err) {
        // do something
      }
      callback(stream)
    })
  }

  var _findBySecret = function(secret, callback) {
    _model.find({meraki_secret: secret}, function(err, stream) {
      if (stream != null) {
        callback(stream)
      }
    })
  }

  var _count = function(secret, callback) {
    _model.count({meraki_secret: secret}, function(err, count) {
      if (count != null) {
        callback(count)
      }
    })
  }

  var _batchCreate = function(data, callback){

    secret = data.secret;
    created_at = (new Date).getTime();

    for(var i = 0; i < data.probing.length; i++) {
      var obj = data.probing[i];
      obj.meraki_secret = secret
      obj.created_at = created_at
      _model.create(obj, function(stream) {})
    }
    callback(true)
  }

  return {
    schema          : streamSchema,
    model           : _model,
    create          : _create,
    batchCreate     : _batchCreate,
    findBySecret    : _findBySecret,
    count           : _count
  }
}();

module.exports = Stream;
