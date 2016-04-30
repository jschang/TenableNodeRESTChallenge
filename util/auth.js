var util = require('../util.js');

module.exports = {
  wrap:function(cb) {
    util.dbg('AUTH WRAPPER WRAPPING');
    return (req,res) => {
      //console.log(cb.toString());
      var data = require('url').parse(req.url,true).query;
      if(!data.token) {
        req.emit('error',new util.request.error(401,"Unauthorized"));
        return;
      }
      util.dbg('AUTH WRAPPER checking authentication');
      util.request.exec('GET','/auth?token='+data.token,null,function(authRes) {
        if(authRes.statusCode==200) {
          util.dbg('AUTH WRAPPER executing callback');
          cb(req,res);
        } else {
          util.dbg("Unauthorized");
          req.emit('error',new util.request.error(401,"Unauthorized"));
        }
      });
    }
  } 
}
