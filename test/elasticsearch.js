var client = require('../lib/clients');
var nas = require('../lib/nas');
var es = require('../lib/elasticsearch');
var stream = require('../lib/streams');
var config = require('./config');

var elasticsearch = require('elasticsearch');
var _client = new elasticsearch.Client({
  host: config.es.host + ":" + config.es.port,
  // log: 'trace'
});


describe("Elasticsearch", function(){

  after(function(done){
    _client.indices.exists({index: 'test'}, function(err,res) {
      if (res == true) {
        console.log("Deleted index")
        _client.indices.delete({index: 'test'})
      }
    })
    done();
  });


  it("should create an alias for es", function(done) {

    var index_name = 'test'
    es.create_aliases(index_name, function(alias_name) {
      es.client.indices.getMapping({
        index: alias_name,
      }, function(err,res) {
        res[alias_name]["mappings"][index_name]["properties"].should.not.equal([])
        done();
      })
    })
  })

  it("should swap the mappings / index over", function(done) {

    var index_name = 'test'
    es.create_aliases(index_name, function(alias_name) {
      console.log(alias_name)
      es.swap_aliases(index_name, alias_name, function(res) {
        console.log(res)
        done();
      })
    })
  })

});

