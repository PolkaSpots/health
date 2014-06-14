var Stream = function(){
  var mongoose = require('mongoose');
  var Schema = require('mongoose').Schema;
  var es = require('./elasticsearch');
  var nas = require('./nas');
  var ps = require('./polkaspots');

  // es.put_mapping();

  var streamSchema = new Schema({
    ap_mac: String,
    rssi: Number,
    last_seen: Date,
    is_associated: Boolean,
    client_mac: String,
    meraki_secret: String,
    created_at: String,
    location_id: Number,
    description: String,
    latitude: Number,
    longitude: Number
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

  var _findAll = function(callback) {
    _model.find(function(err, stream) {
      if (stream != null) {
        callback(stream)
      }
    })
  }

  var _findByApMac = function(ap_mac, callback) {
    _model.find({ap_mac: ap_mac}, function(err, stream) {
      if (stream != null) {
        callback(stream)
      }
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

      ap_clean = obj.ap_mac.split(':').join('-').toUpperCase();
      client_clean = obj.client_mac.split(':').join('-').toUpperCase();

      box = nas.findByMac(ap_clean, function(nas) {

        if ( nas != null ) {
          obj.location_id = nas.location_id
          obj.latitude = nas.latitude
          obj.longitude = nas.longitude
          obj.description = nas.description
          obj.type = nas.type
          obj.slug = nas.slug
        }
        else {
          // queue job to notify CT //
        }

        obj.meraki_secret = secret
        obj.created_at = created_at
        obj.ap_mac = ap_clean
        obj.client_mac = client_clean

        _model.create(obj, function(stream) {
          es.index('stream', obj, function(resp) {
            // console.log(resp)
          })
        })
      })

    }
    callback(true)
  }

  var _reindex = function(index_name, callback){
    es.create_aliases(index_name, function(alias_name) {
      console.log("Index created: " + alias_name)
      if (alias_name != null) {
        _findAll(function(docs) {
          for(var i=0; i<docs.length; i++) {
            es.index(alias_name, docs[i], function(){} )
          }
          console.log("Import complete...")
          es.swap_aliases(index_name, alias_name, function(res) {
            console.log("Swap aliases: " + res)
          })
        })
      }
      callback("asdfasdftrue")
    })
  }

  return {
    schema          : streamSchema,
    model           : _model,
    create          : _create,
    batchCreate     : _batchCreate,
    findBySecret    : _findBySecret,
    findByApMac     : _findByApMac,
    findAll         : _findAll,
    count           : _count,
    reindex         : _reindex
  }
}();

module.exports = Stream;
