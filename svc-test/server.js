const assert = require('assert');
const http = require('http');
const util = require('../util.js');

module.exports = function(onEnd) {
testInvalidMethod(function() {
testBadMethod(function() {
testBadPath(function() {
util.log('server test passed');
if(onEnd) onEnd();
})})})
}
 
var testInvalidMethod = (onEnd) => {
  // make sure that bad logins are rejected
  util.request.exec('INVALID_METHOD','/auth',{username:'jschang',password:'asdf'},null,() => {
    // just the rest of the tests proceeding after this proves that the server didn't die
    if(onEnd) onEnd();
  });
}
var testBadMethod = (onEnd) => {
  // make sure that bad logins are rejected
  util.request.exec('PATCH','/auth',{username:'jschang',password:'asdf'},
    (res)=>{
      var data = JSON.parse(res.body);
      assert.equal(404,res.statusCode,"Expected a 404 response");
      assert.equal(true,data.error,"Error flag should have been returned");
      assert.equal("Not Found",data.message,"Error message should have been 'Not Found'");
      if(onEnd) onEnd();
    }
  );
}
var testBadPath = (onEnd) => {
  // make sure that bad logins are rejected
  util.request.exec('POST','/badpath',{username:'jon',password:'fantastic1'},
    (res)=>{
      var data = JSON.parse(res.body);
      assert.equal(404,res.statusCode,"Expected a 404 response");
      assert.equal(true,data.error,"Error flag should have been returned");
      assert.equal("Not Found",data.message,"Error message should have been 'Not Found'");
      if(onEnd) onEnd();
    }
  );
}

