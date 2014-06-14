var mongoose = require("mongoose");
var client = require('../lib/clients');
var nas = require('../lib/nas');
var stream = require('../lib/streams');
var config = require('../lib/config');
// mongoose.connect(config.db.mongodb);

describe("Streams", function(){

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

  it("should find all streams", function(done){
    client_mac = '00:11:22:33:44:55'
    ap_mac = '00:11:22:33:44:AA'
    options = {
      ap_mac: ap_mac,
      rssi: 12,
      is_associated: true,
      client_mac: client_mac,
      last_seen: "12312312",
      meraki_secret: secret,
      created_at: (new Date).getTime(),
    }

    stream.create(options, function(doc) {
      stream.findAll(function(doc) {
        doc[0].ap_mac.should.equal(ap_mac)
        done();
      })
    })
  });

  it("should find streams by ap_mac", function(done){
    client_mac = '00:11:22:33:44:55'
    ap_mac = '00:11:22:33:44:AA'
    options = {
      ap_mac: ap_mac,
      rssi: 12,
      is_associated: true,
      client_mac: client_mac,
      last_seen: "12312312",
      meraki_secret: secret,
      created_at: (new Date).getTime(),
    }

    stream.create(options, function(doc) {
      stream.findByApMac(ap_mac, function(doc) {
        doc[0].ap_mac.should.equal(ap_mac)
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
      location_id: 123,
      lonitude: 22,
      latitude: 0.1,
      description: "Hello"
    }

    stream.create(options, function(doc) {
      stream.count(secret, function(doc) {
        doc.should.not.equal(0)
        done();
      })
    })
  });

  it("should reindex the mother fucking data base", function(done){

    stream.create(options, function(doc) {
      stream.reindex(function(resp) {
        console.log(resp)
        done();
      })
    })
  })

  // it("should save the entire stream - with ap_mac found", function(done) {

  //   ap_mac_1 = '00-18-0A-33-2E-F2'
  //   data = JSON.parse('{"version":"1.0","secret":"b135bc7d5110a7f374799985e2a6497d","probing":[{"ap_mac":"00:18:0a:33:2e:f2","rssi":"40","is_associated":"false","client_mac":"2c:e6:cc:2c:36:08","last_seen":"Thu Jun 12 00:40:33.502 UTC 2014"},{"ap_mac":"00:18:0a:33:2e:f2","rssi":"9","is_associated":"false","client_mac":"20:02:af:45:a8:78","last_seen":"Thu Jun 12 00:39:26.502 UTC 2014"},{"ap_mac":"00:18:0a:33:2e:f2","rssi":"14","is_associated":"false","client_mac":"cc:3a:61:a4:a4:bf","last_seen":"Thu Jun 12 00:38:59.502 UTC 2014"},{"ap_mac":"00:18:0a:33:2e:f2","rssi":"30","is_associated":"true","client_mac":"7c:d1:c3:d8:ae:99","last_seen":"Thu Jun 12 00:40:33.502 UTC 2014"}]}')

  //   options = {
  //     ap_mac: ap_mac_1,
  //     location_id: 1,
  //     latitude: 51.53,
  //     longitude: -0.01,
  //     description: "Hi Simon",
  //     type: "Airrouter",
  //     slug: "slugy-wugy"
  //   }

  //   nas.create(options, function(doc) {
  //     doc.ap_mac.should.equal(ap_mac_1)
  //     stream.batchCreate(data, function(doc) {
  //       doc.should.equal(true)
  //     })
  //   })
  //   done()
  // })

});

