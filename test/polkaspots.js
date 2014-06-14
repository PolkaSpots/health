var ps = require('../lib/polkaspots');
var config = require('../lib/config');

describe("Polkaspots", function(){

  it("return a cleaned mac", function(done){
    ap_mac = '00:aa:22:33:44:55'

    ps.clean_mac(ap_mac, function(doc) {
      doc.should.equal('00-AA-22-33-44-55')
      done()

    })
  })

});

