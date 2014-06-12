var mongoose = require("mongoose");
var client = require('../lib/clients');
var stream = require('../lib/streams');
var config = require('./config-debug');
// mongoose.connect(config.db.mongodb);

describe("Streams", function(){

  // var currentClient = null;
  // beforeEach(function(done){
  //   var unique_id = '1224994674865919342'
  //   var validator = 'c2eabf59fbb5b0277690f8b134852c8d841c6e07'
  //   var secret = 'b135bc7d5110a7f374799985e2a6497d'

  //   client.create(unique_id, validator, secret, function(client) {
  //     currentClient = client;
  //     client.unique_id.should.equal(unique_id);
  //     client.meraki_validator.should.equal(validator);
  //     client.meraki_secret.should.equal(secret);
  //     done();
  //   });
  // });

  afterEach(function(done){
    stream.model.remove({}, function() {
      done();
    });
  });

  it("should create a single stream", function(done){
    client_mac = '00:11:22:33:44:55'
    options = {
      ap_mac: "ap_mac",
      rssi: 12,
      is_associated: true,
      client_mac: client_mac,
      last_seen: "12312312",
      meraki_secret: "secret",
      created_at: (new Date).getTime(),
    }

    stream.create(options, function(doc) {
      doc.ap_mac.should.equal("ap_mac")
      done();
    })
  })

  it("should find streams by secret", function(done){
    secret = 123,
    client_mac = '00:11:22:33:44:55'
    options = {
      ap_mac: "ap_mac",
      rssi: 12,
      is_associated: true,
      client_mac: client_mac,
      last_seen: "12312312",
      meraki_secret: secret,
      created_at: (new Date).getTime(),
    }

    stream.create(options, function(doc) {
      stream.findBySecret(secret, function(doc) {
        doc[0].ap_mac.should.equal("ap_mac")
        doc[0].client_mac.should.equal(client_mac)
        done();
      })
    })
  });

  it("should count the streams", function(done){
    secret = 123,
    client_mac = '00:11:22:33:44:55'
    options = {
      ap_mac: "ap_mac",
      rssi: 12,
      is_associated: true,
      client_mac: client_mac,
      last_seen: "12312312",
      meraki_secret: secret,
      created_at: (new Date).getTime(),
    }

    stream.create(options, function(doc) {
      stream.count(secret, function(doc) {
        console.log(doc)
        done();
      })
    })
  });

  it("should save the entire stream", function(done) {

    data = JSON.parse('{"version":"1.0","secret":"b135bc7d5110a7f374799985e2a6497d","probing":[{"ap_mac":"00:18:0a:33:2e:f2","rssi":"40","is_associated":"false","client_mac":"2c:e6:cc:2c:36:08","last_seen":"Thu Jun 12 00:40:33.502 UTC 2014"},{"ap_mac":"00:18:0a:33:2e:f2","rssi":"9","is_associated":"false","client_mac":"20:02:af:45:a8:78","last_seen":"Thu Jun 12 00:39:26.502 UTC 2014"},{"ap_mac":"00:18:0a:33:2e:f2","rssi":"14","is_associated":"false","client_mac":"cc:3a:61:a4:a4:bf","last_seen":"Thu Jun 12 00:38:59.502 UTC 2014"},{"ap_mac":"00:18:0a:33:2e:f2","rssi":"30","is_associated":"true","client_mac":"7c:d1:c3:d8:ae:99","last_seen":"Thu Jun 12 00:40:33.502 UTC 2014"}]}')
    stream.batchCreate(data, function(doc) {
      doc.should.equal(true)
      done();
    })
  })

  it("should count the streams", function(done) {

    data = JSON.parse('{"version":"1.0","secret":"b135bc7d5110a7f374799985e2a6497d","probing":[{"ap_mac":"00:18:0a:33:2e:f2","rssi":"40","is_associated":"false","client_mac":"2c:e6:cc:2c:36:08","last_seen":"Thu Jun 12 00:40:33.502 UTC 2014"},{"ap_mac":"00:18:0a:33:2e:f2","rssi":"9","is_associated":"false","client_mac":"20:02:af:45:a8:78","last_seen":"Thu Jun 12 00:39:26.502 UTC 2014"},{"ap_mac":"00:18:0a:33:2e:f2","rssi":"14","is_associated":"false","client_mac":"cc:3a:61:a4:a4:bf","last_seen":"Thu Jun 12 00:38:59.502 UTC 2014"},{"ap_mac":"00:18:0a:33:2e:f2","rssi":"30","is_associated":"true","client_mac":"7c:d1:c3:d8:ae:99","last_seen":"Thu Jun 12 00:40:33.502 UTC 2014"}]}')
    stream.batchCreate(data, function(doc) {
      doc.should.equal(true)
      done();
    })
  })

});

