const util = require('../../util.js');
const model = require('./model.js');

module.exports = function(req,res) {
  util.dbg('entering /auth/login')
  var data = JSON.parse(req.body);
  if(!data.username || !data.password) {
    throw new util.request.error(400,"Both 'username' and 'password' parameters must be sent");
  }
  model.fetchUser(data.username,function(user) {
    if(user) {
      util.dbg('found user: ',data.username);
      if(model.checkPassword(user,data.password)) {
        model.startSession(user,function(token) {
          if(token){
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({token:token}));
          } else {
            req.emit('error',new util.request.error(500,"Unable to begin session"));
          }
        });  
      } else {
        req.emit('error',new util.request.error(401,"Unauthorized"));
      }
    } else {
      req.emit('error',new util.request.error(404,"Not Found"));
    }
  });
}
