var nodeUtil = require('util');
const http = require('http');
const util = require('../util.js');
const sharedConfig = require('../shared-config.js');

function RequestError(statusCode,message) {  
  Error.call(this);
  this.statusCode = statusCode;
  this.message = message;
}
nodeUtil.inherits(RequestError, Error);

module.exports = {
  error:RequestError,
  handleServerError:function(req,res,e) {
    if(e instanceof util.request.error) {
      util.dbg('responding with ',e.statusCode,' and message ',e.message);
      if(!res.finished) {
        res.writeHead(e.statusCode,{'Content-Type':'application/json'});
        res.end(JSON.stringify({error:true,message:e.message}));
      }
    } else {
      util.dbg('server exception:',e);
      if(!res.finished) {
        res.writeHead(500,{'Content-Type':'application/json'});
        res.end(JSON.stringify({error:true,message:(e?e.message:null)}));
      }
    }
  },
  exec:function(method,path,obj,callback) {  
    var headers = {};
    var postData = null;
    if(obj!==null) {
      postData = JSON.stringify(obj);
      util.dbg('postData='+postData);
      Object.assign(headers,{
      'Content-Type':'application/json',
      'Content-Length':postData.length
      });
    }
    var options = {
      hostname:sharedConfig.api.host,
      port:sharedConfig.api.port,
      path:path,
      method:method,
      headers:headers
    }
    util.dbg(method+'ing to '+path+': '+postData);
    var req = null;
    try {
       req = http.request(options, (res) => {
        var data = [];
        util.dbg('status code: ',res.statusCode);
        util.dbg('status message: ',res.statusMessage);
        util.dbg('headers: ',res.headers);
        res
          .on('data',function(d){
            data.push(d)
          })
          .on('end',function(d){
            data = Buffer.concat(data).toString()
            res.body = data;
            util.dbg(method+'ing response for '+path+': ',data);
            callback(res);
          })
      });
      req.on('error',function(e) {
          util.log('request error: ',e);
      });
      if(postData) {
        req.write(postData);
      }
    } finally {
      if(req && !req.finished) req.end();
    }
  }
}
