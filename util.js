const crypto = require('crypto');
const sharedConfig = require('./shared-config.js');

var util = module.exports = {
  toArray:function(obj) {
    var args = []
    for(var i in obj) {
      args.push(obj[i])
    }
    return args;
  },
  log:function() {
    var args = this.toArray(arguments);
    args.unshift(new Date().toISOString()+' ');
    console.log.apply(this,args);
  },
  dbg:function() {
    if(sharedConfig.logging.debug) {
      var args = this.toArray(arguments);
      this.log.apply(this,args)
    }
  },
  hmac:{
    sha256:function(password,secret) {
      return crypto.createHmac('sha256',secret).update(password).digest('hex')
    }
  }
}
util['request'] = require('./util/request.js');
util['auth'] = require('./util/auth.js');
