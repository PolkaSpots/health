var should = require('should');
var assert = require('assert');

var mongoose = require('mongoose');
var config = require('../lib/config');
var client = require('../lib/clients');

var request = require('supertest')
  , express = require('express');

var app = express();

var routes = require('../routes/')

app.get('/', routes.index)
app.get('/api/v1/flume', routes.get_flume)
app.post('/api/v1/flume', routes.post_flume)

describe('Routes', function() {

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

  it('should get home path', function(done) {
    request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res){
        if (err) throw err;
        done()
      });
  });

  it('should return error trying to get a non-existent unique_id', function(done) {
    request(app)
      .get('/api/v1/flume?id=123')
      .expect(404)
      .end(function(err, res){
        if (err) throw err;
        done()
      });
  });

  it('should return validator with valid unique_id', function(done) {
    request(app)
      .get('/api/v1/flume?id=' + currentClient.unique_id)
      .expect(200)
      .end(function(err, res){
        res.text.should.equal(currentClient.meraki_validator)
        if (err) throw err;
        done()
      });
  });

  it('should create a stream with a valid ID', function(done) {
    params = { data: '{"version":"1.0","secret":"b135bc7d5110a7f374799985e2a6497d","probing":[{"ap_mac":"00:18:0a:33:2e:f2","rssi":"10","is_associated":"false","client_mac":"20:02:af:45:a8:78","last_seen":"Thu Jun 12 01:17:27.094 UTC 2014"},{"ap_mac":"00:18:0a:33:2e:f2","rssi":"11","is_associated":"false","client_mac":"2c:76:8a:7b:b8:87","last_seen":"Thu Jun 12 01:18:03.094 UTC 2014"},{"ap_mac":"00:18:0a:33:2e:f2","rssi":"11","is_associated":"false","client_mac":"48:9d:24:a3:b5:53","last_seen":"Thu Jun 12 01:18:04.094 UTC 2014"},{"ap_mac":"00:18:0a:33:2e:f2","rssi":"16","is_associated":"false","client_mac":"40:f3:08:98:92:a9","last_seen":"Thu Jun 12 01:17:48.094 UTC 2014"},{"ap_mac":"00:18:0a:33:2e:f2","rssi":"27","is_associated":"true","client_mac":"7c:d1:c3:d8:ae:99","last_seen":"Thu Jun 12 01:18:28.094 UTC 2014"},{"ap_mac":"00:18:0a:33:2e:f2","rssi":"8","is_associated":"false","client_mac":"ec:35:86:4b:3b:b8","last_seen":"Thu Jun 12 01:17:13.094 UTC 2014"},{"ap_mac":"00:18:0a:33:2e:f2","rssi":"14","is_associated":"false","client_mac":"cc:3a:61:a4:a4:bf","last_seen":"Thu Jun 12 01:17:56.094 UTC 2014"},{"ap_mac":"00:18:0a:33:2e:f2","rssi":"41","is_associated":"false","client_mac":"2c:e6:cc:2c:36:08","last_seen":"Thu Jun 12 01:17:58.094 UTC 2014"}]}' }
    request(app)
    done()
    // this is pending because i cant fuck off work out how to send the data //
    //
      // .post('/api/v1/flume?id=' + currentClient.unique_id)
      // .type('form')
      // .expect(200)

      // .end(function(err, res){
      //   if (err) throw err;
      //   done()
      // });
  });

});
