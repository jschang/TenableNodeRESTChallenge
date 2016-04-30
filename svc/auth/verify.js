const util = require('../../util.js');
const model = require('./model.js');

module.exports = (req,res)=>{ 
  util.dbg('entering /auth/verify')
  var data = require('url').parse(req.url,true).query
  if(!data.token) {
    req.emit('error',new util.request.error(400,"Missing 'token' parameter"));
  }
  model.getSession(data.token,function(session) {
      if(session) {
      util.dbg('got token: ',data.token);
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({error:false}));
    } else {
      req.emit('error',new util.request.error(404,"Not Found"));
    }
  });
};
