var Elasticsearch = function(){
  var config = require('./config');
  var elasticsearch = require('elasticsearch');
  var _client = new elasticsearch.Client({
    host: config.es.host + ":" + config.es.port,
    log: 'trace'
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

    '{"query":{"match_all":{}},"filter":{},"size":250,"facets":{"boxes":{"terms":{"field":"ap_mac"}}}}'
  var _put_mapping = function(callback) {

    // _client.indices.exists({

    // })

    _client.indices.delete({
      index: 'stream'
    })

    _client.indices.create({
      index: 'stream'
    })

    _client.indices.putMapping({
      index: 'stream',
      type: 'stream',
      body: {
        'stream': {
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
            meraki_secret: { type: 'string', "index" : "not_analyzed" }
          }
        }
      }
      }).then(function (response) {
        console.log(response)
    });
  }


  var _index = function(object, callback) {
    _client.index({
      index: 'stream',
      type: 'stream',
      // id: 1,
      body: {
        meraki_secret: object.meraki_secret,
        created_at: object.created_at,
        ap_mac: object.ap_mac,
        client_mac: object.client_mac,
        rssi: object.rssi,
        last_seen: object.last_seen,
        is_associated: object.is_associated
      }
    }).then(function (resp) {
      console.log(resp)
    });
  };

  return {
    client          : _client,
    index           : _index,
    put_mapping      : _put_mapping
  }
}();

module.exports = Elasticsearch;
