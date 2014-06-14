
var Elasticsearch = function(){
  var config = require('./config');
  var elasticsearch = require('elasticsearch');
  var _client = new elasticsearch.Client({
    host: config.es.host + ":" + config.es.port,
    // log: 'trace'
  });

  _client.ping({
    // ping usually has a 100ms timeout
    requestTimeout: 1000,

    // undocumented params are appended to the query string
    hello: "elasticsearch!"
  }, function (error) {
    if (error) {
      console.trace('elasticsearch cluster is down!');
    } else {
      console.log('All is well');
    }
  });

  var _delete_index = function(index_name, callback) {
    _client.indices.delete({
      index: index_name
    })
    callback(true)
  }

  var _swap_aliases = function(index_name, alias_name, callback) {

    _client.indices.create({
      index: index_name,
    }, function(err, res) {
      _client.indices.putAlias({
        index: alias_name,
        name: index_name
      }, function(err, res) {
        if (err) {
          console.log("error")
        }
        else {
          console.log("Fine")
        }
      })
    });
    callback(true)
  }

  var _create_aliases = function(index_name, callback) {

    var timestamp = +new Date();
    var alias_name = index_name + "_" + timestamp

    console.log("Creating index: " + alias_name )
    _client.indices.create({
      index: alias_name
    }, function(err, res) {

      _put_mapping(alias_name, function(res) {
        callback(alias_name)
      });
    })
  }


  var _put_mapping = function(index_name, callback) {

      _client.indices.putMapping({
        index: index_name,
        type: index_name,
        body: {
          properties: {
            ap_mac: {
              type: 'multi_field',
              fields: {
                sortable: { type: 'string', "index" : "not_analyzed" },
                raw: { type: 'string', "index" : "analyzed" },
              }
            },
            client_mac: {
              type: 'multi_field',
              fields: {
                sortable: { type: 'string', "index" : "not_analyzed" },
                raw: { type: 'string', "index" : "analyzed" },
              }
            },
            // created_at: { type: 'integer' },
            // last_seen: { type: 'datetime' },
            is_associated: { type: 'boolean' },
            rssi: { type: 'integer' },
            meraki_secret: { type: 'string', "index" : "not_analyzed" },
            location_id: { type: 'integer' },
            description: { type: 'string' },
            slug: { type: 'string', index: 'not_analyzed' },
            latitude: { type: 'geo_point' },
            longitude: { type: 'geo_point' },
            mongo_id: { type: 'string' }
          }
        }
      }).then(function (response) {
        callback(true);
    });
  }


  var _index = function(index_name, object, callback) {
    delete object["_id"]
    _client.index({
      index: index_name,
      type: 'stream',
      // id: 1,
      body: {

        meraki_secret: object.meraki_secret,
        created_at: object.created_at,
        ap_mac: object.ap_mac,
        client_mac: object.client_mac,
        rssi: object.rssi,
        last_seen: object.last_seen,
        is_associated: object.is_associated,
        description: object.description,
        location_id: object.location_id,
        latitude: object.latitude,
        longitude: object.longitude,
        mongo_id: object._id

        }
    }).then(function (resp) {
      // console.log(resp)
    });
  };

  return {
    client          : _client,
    index           : _index,
    put_mapping     : _put_mapping,
    create_aliases  : _create_aliases,
    delete_index    : _delete_index,
    swap_aliases    : _swap_aliases
  }
}();

module.exports = Elasticsearch;