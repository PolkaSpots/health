var Polkaspots = function(){

  var _clean_mac = function(mac, callback){
    cleaned = mac.split(':').join('-').toUpperCase()
    callback(cleaned)
  }

  return {
    clean_mac       : _clean_mac
  }
}();

module.exports = Polkaspots;
