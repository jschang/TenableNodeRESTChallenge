const sharedConfig = require('../../shared-config.js');
const util = require('../../util.js');

var data = require('./data.js');
var sharedSecret = sharedConfig.sessions.sharedSecret;
var tokenTtl = sharedConfig.sessions.tokenTtl;

/*
  I decided to implement these with callbacks,
  as in the real-world we'd be talking to a server
  like Mongo.
  In the real-world, there would be an error call back as well.
*/

module.exports = {
  /**
   * @param callback cb(user:object) the user object if found, else null
   */
  fetchUser:function(username,cb) {
    util.dbg('model.fetchUser(',username,')')
    if(data.users[username]){
      cb(Object.assign({},data.users[username],{name:username}))
      return;
    }
    cb(null);
  },
  /**
   * No io implied, so no need for a callback.
   */
  checkPassword:function(user,password) {
    // util.hmac.sha256(user.password+user.serverSecret,sharedSecret)
    var userHash = user.password;
    var argHash = util.hmac.sha256(password+user.serverSecret,sharedSecret);
    util.dbg('model.fetchUser userHash:',userHash,' = argHash:',argHash);
    if(userHash==argHash)
      return true;
    return false;
  },
  /**
   * @param callback cb(token:string) the session token created for the user
   */
  startSession:function(user,cb) {
    // TODO: check max number of sessions
    var nonce = Math.floor(Math.random()*1000000);
    var expire = (Date.now()/1000)+tokenTtl;
    var toHash = nonce+'.'+expire;
    var hash = util.hmac.sha256(toHash,user.serverSecret);
    var token = toHash+'.'+hash;
    var sessionObj = {};
    // to allow for prior-ttl revocation
    data.sessions[token] = {expire:expire,user:user.username};
    util.dbg('created token: ',token);
    cb(token);
  },
  /**
   * @param callback cb(token:object) the session token object created for the user, else false
   */
  getSession:function(token,cb) {
    if(typeof(data.sessions[token])=='object') {
      cb(data.sessions[token]);
      return;
    }
    cb(false);
  },
  /**
   * @param callback cb(success:boolean) true if a session was deleted, else false
   */
  endSession:function(token,cb) {
    if(typeof(data.sessions[token])=='object') {
      delete data.sessions[token];
      cb(true);
      return;
    }
    cb(false);
  }
}

