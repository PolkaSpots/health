var mongoose = require("mongoose");
var nas = require('../lib/nas');
var config = require('./config-debug');
// mongoose.connect(config.db.mongodb);

describe("Nas", function(){

  var currentClient = null;
  beforeEach(function(done){
    ap_mac = '00-11-22-33-44-55'
    options = {
      ap_mac: ap_mac,
      location_id: 1,
      latitude: 51.53,
      longitude: -0.01,
      description: "Hi Simon",
      type: "Airrouter",
      slug: "slugy-wugy"
    }

    nas.create(options, function(doc) {
      doc.ap_mac.should.equal(ap_mac)
      doc.location_id.should.equal(1)
      doc.latitude.should.equal(51.53)
      doc.longitude.should.equal(-0.01)
      doc.description.should.equal("Hi Simon")
      doc.type.should.equal("Airrouter")
      doc.slug.should.equal("slugy-wugy")
      done();
    })
  });

  afterEach(function(done){
    nas.model.remove({}, function() {
      done();
    });
  });

  it("should update a nas", function(done){
    ap_mac = '00-11-22-33-44-55'
    update = {
      ap_mac: ap_mac,
      location_id: 1,
      latitude: 123,
      longitude: 345,
      description: "Hi Simon",
      type: "Airrouter",
      slug: "slugy-wugy"
    }

    nas.update(ap_mac, update, function(doc) {
      doc.location_id.should.equal(1)
      doc.latitude.should.equal(123)
      doc.longitude.should.equal(345)
      doc.description.should.equal("Hi Simon")
      doc.type.should.equal("Airrouter")
      doc.slug.should.equal("slugy-wugy")
      done();
    })
  })

  it("should NOT update a nas, creates one instead", function(done){
    ap_mac = '123'
    update = {
      ap_mac: ap_mac,
    }

    nas.update(ap_mac, update, function(doc) {
      doc.ap_mac.should.equal('123')
      done();
    })
  })

  it("should find a nas by mac", function(done){
    ap_mac = '00-11-22-33-44-55'
    nas.findByMac(ap_mac, function(doc) {
      doc.ap_mac.should.equal(ap_mac)
      done();
    })
  })

});

