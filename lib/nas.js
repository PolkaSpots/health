var Nas = function(){
  var mongoose = require('mongoose');
  var Schema = require('mongoose').Schema;
  var ps = require('./polkaspots');

  // var es = require('./elasticsearch');

  var nasSchema = new Schema({
    ap_mac: String,
    location_id: Number,
    latitude: Number,
    longitude: Number,
    description: String,
    type: String,
    slug: String
  });

  var _model = mongoose.model('Nas', nasSchema);

  var _create = function(options, callback){
    nas = new _model(options);
    nas.save(function (err) {
      if (err) {
        callback(err)
        // do something
      }
      else {
        callback(nas)
      }
    })
  }

  var _update = function(mac, update, callback){

    var query = { ap_mac: mac }
    var options = {new: true};
    _model.findOneAndUpdate(query, update, options, function(err, doc) {
      if (err == null && doc) {
        callback(doc)
        // do something
      }
      else if ( err == null ) {
        _model.create(update, function(err,nas) {
         callback(nas)
        })
      }
      else {
        callback("Nas import broken")
      }
    })
  }

  var _findByMac = function(mac, callback) {
    cleaned = ps.clean_mac(mac, function() {
      _model.findOne({ap_mac: cleaned}, function(err, nas) {
        callback(nas)
      })
    })
  }

  return {
    schema          : nasSchema,
    model           : _model,
    create          : _create,
    update          : _update,
    findByMac       : _findByMac
  }
}();

module.exports = Nas;
