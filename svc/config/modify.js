const util = require('../../util.js');
const model = require('./model.js');

module.exports = util.auth.wrap((req,res)=>{ 
  var newConfig = JSON.parse(req.body);
  if( !newConfig.name
    || !newConfig.username
    || !newConfig.hostname
    || !newConfig.port) {
    req.emit('error',new util.request.error(400,"All configurations must have a name, username, hostname, and port"));
    return;
  }
  if(typeof(newConfig.port)!='number') {
    req.emit('error',new util.request.error(400,"'port' must be numeric"));
    return;
  }
  model.update(newConfig,(success)=>{
    if(success) {
      res.writeHead(200,{'Content-Type':'application/json'});
      res.end(JSON.stringify({error:false}));
    } else {
      req.emit('error',new util.request.error(409,"Unable to update"));
    }
  });
});
