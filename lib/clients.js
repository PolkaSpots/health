var Client = function(){
  var mongoose = require('mongoose');
  var Schema = require('mongoose').Schema;
  var clientSchema = new Schema({
    unique_id: String,
    meraki_secret: String,
    meraki_validator: String,
    created_at: String
  });

  var _model = mongoose.model('Clients', clientSchema);

  var _findByUniqueId = function(unique_id, callback){
    _model.findOne({ unique_id: unique_id }, function(err, client) {
      if( err == null && client ){
        callback(client);
      }
      else {
        callback(false);
      }
   });
  }

  var _getSecret = function(unique_id, callback){
    _model.findOne({ unique_id: unique_id }, "meraki_secret", function(err, client) {
      if( err == null && client ){
        callback(client.meraki_secret);
      }
      else {
        callback(false);
      }
   });
  }

  var _create = function(unique_id, validator, secret, callback){
    _model.findOne({ unique_id: unique_id }, function(err, client) {
      if( client == null ){
        client = new _model({
          unique_id: unique_id,
          meraki_validator: validator,
          meraki_secret: secret,
          created_at: (new Date).getTime()
        });
        client.save(function (err) {
          if (err) {
            // do something
          }
          callback(client)
        })
      }
      else {
        callback(false);
      }
   });
  }

  var _update = function(unique_id, update, callback) {
    var query = { unique_id: unique_id };
    var options = {new: true};
    _model.findOneAndUpdate(query, update, options, function(err, client) {
      if (err == null) {
        callback(client)
      }
      else {
        callback(false)
      }
    })
  };

  var _delete = function(unique_id, callback) {
    query = { unique_id: unique_id }
    _model.remove(query, function(err) {
      if (err == null) {
        callback(true)
      }
      else {
        callback(false)
      }
    })
  };

  return {
    schema          : clientSchema,
    model           : _model,
    create          : _create,
    findByUniqueId  : _findByUniqueId,
    getSecret       : _getSecret,
    update          : _update,
    delete          : _delete
  }
}();

module.exports = Client;
