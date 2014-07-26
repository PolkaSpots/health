var url = require('url');

exports.index = function(req,res) {
  res.json(JSON.stringify({message: "Phone home"}));
};

