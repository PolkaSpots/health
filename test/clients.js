var mongoose = require("mongoose");
var client = require('../lib/clients');
var config = require('./config-debug');
mongoose.connect(config.db.mongodb);

describe("Clients", function(){

  var currentClient = null;
  beforeEach(function(done){
    var unique_id = '1224994674865919342'
    var validator = 'c2eabf59fbb5b0277690f8b134852c8d841c6e07'
    var secret = 'b135bc7d5110a7f374799985e2a6497d'

    client.create(unique_id, validator, secret, function(client) {
      currentClient = client;
      client.unique_id.should.equal(unique_id);
      client.meraki_validator.should.equal(validator);
      client.meraki_secret.should.equal(secret);
      done();
    });
  });

  afterEach(function(done){
    client.model.remove({}, function() {
      done();
    });
  });

  it("should not create a duplicate client", function(done){
    var unique_id = '1224994674865919342'
    var validator = 'c2eabf59fbb5b0277690f8b134852c8d841c6e07'
    var secret = 'b135bc7d5110a7f374799985e2a6497d'

    client.create(unique_id, validator, secret, function(client) {
      client.should.equal(false)
      done();
    })
  });

  it("finds a client by unique id", function(done){
    var secret = 'b135bc7d5110a7f374799985e2a6497d'
    client.findByUniqueId(currentClient.unique_id, function(doc) {
      doc.meraki_secret.should.equal(secret);
      done();
    })
  });

  it("finds a client by unique id and returns the meraki secret only", function(done){
    var secret = 'b135bc7d5110a7f374799985e2a6497d'
    client.getSecret(currentClient.unique_id, function(doc) {
      doc.should.equal(secret);
      done();
    })
  });

  it("updates a client by id", function(done){
    var secret = '123456'
    options = { meraki_secret: secret, meraki_validator: 123 }
    client.update(currentClient.unique_id, options, function(doc) {
      doc.meraki_secret.should.equal(secret);
      doc.meraki_validator.should.equal('123');
      done();
    })
  });

  it("removes a client by id", function(done){
    client.delete(currentClient.unique_id, function(doc) {
      doc.should.equal(true);
      done();
    })
  });

});

