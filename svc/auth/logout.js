const util = require('../../util.js');
const model = require('./model.js');

module.exports = (req,res)=>{ 
  util.dbg('entering /auth/logout')
  var data = require('url').parse(req.url,true).query
  if(!data.token) {
    throw new util.request.error(400,"Missing 'token' parameter");
  }
  model.endSession(data.token,function(succ){  
    if(succ) {
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({error:false}));
    } else {
      req.emit('error',new util.request.error(404,"Not Found - session does not exist"));
    }  
  });
};
