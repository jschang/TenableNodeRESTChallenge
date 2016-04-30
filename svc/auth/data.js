const sharedConfig = require('../../shared-config.js');
const util = require('../../util.js');

var sharedServerSecret = sharedConfig.sessions.sharedSecret;

var data = module.exports = {
    users:{
        jon:{
            serverSecret:util.hmac.sha256(''+Math.random(),sharedServerSecret),
            password:'fantastic'
        },
        james:{
            serverSecret:util.hmac.sha256(''+Math.random(),sharedServerSecret),
            password:'taco-tuesday'
        }
    },
    // tokens have a ttl, so the only reason we have this is for prior revocation
    sessions:{}
};

// to simulate a real database, we'll make a pass to one-way hash the passwords
for(var userName in data.users) {
  var user = data.users[userName];
  user.password = util.hmac.sha256(user.password+user.serverSecret,sharedServerSecret)
}

// keep the sessions clean, every 500 millis
setInterval(function() {
    var sessionsCleaned = 0;
    for(var token in data.sessions) {
        if(data.sessions[token].expire <= (Date.now()/1000)) {
            sessionsCleaned++;
            delete data.sessions[token];
        }
    }
    util.dbg('data.sessionsCleaned '+sessionsCleaned+' of '+Object.keys(data.sessions).length);
},5000);
