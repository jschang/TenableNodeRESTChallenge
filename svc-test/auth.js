const assert = require('assert');
const http = require('http');
const util = require('../util.js');

module.exports = function(onEnd) {
testBadLoginUser(function() {
testBadLogin(function() {
testLoginLogout(function() {
if(onEnd) onEnd();
})})})}
    
var testBadLoginUser = (onEnd) => {
  // make sure that bad logins are rejected
  util.request.exec('POST','/auth',{username:'jschang',password:'asdf'},
    (res)=>{
      var data = JSON.parse(res.body);
      assert.equal(404,res.statusCode,"Expected a 404 response");
      assert.equal(true,data.error,"Error flag should have been returned");
      assert.equal("Not Found",data.message,"Error message should have been 'Not Found'");
      if(onEnd) onEnd();
    }
  );
}
var testBadLogin = (onEnd) => {
  // make sure that bad logins are rejected
  util.request.exec('POST','/auth',{username:'jon',password:'fantastic1'},
    (res)=>{
      var data = JSON.parse(res.body);
      assert.equal(401,res.statusCode,"Expected a 401 response");
      assert.equal(true,data.error,"Error flag should have been returned");
      assert.equal("Unauthorized",data.message,"Error message should have been 'Unauthorized'");
      if(onEnd) onEnd();
    }
  );
}
var testLoginLogout = (onEnd) => {
  // login and then perform auth tests
  util.request.exec('POST','/auth',{username:'jon',password:'fantastic'}, (res)=>{
    var data = JSON.parse(res.body);
    assert.equal(200,res.statusCode,"Expected a 200 response");
    assert.equal(null,data.error,"Error flag should not have been returned");
    assert(data.token);
    doVerify(data.token);
  });
  // verify we can verify
  var doVerify = (token) => { 
      util.request.exec('GET','/auth?token='+token,null,(res) => {
      var data = JSON.parse(res.body);
      assert.equal(200,res.statusCode,"Expected a 200 response");
      assert.equal(false,data.error,"Error flag false should have been returned");
      doVerifyBad(token,true);
    });
  }
  // verify that a non-existent token will be not-found
  var doVerifyBad = (token,cont) => {
    util.request.exec('GET','/auth?token=badtoken',null,(res) => {
      var data = JSON.parse(res.body);
      assert.equal(404,res.statusCode,"Expected a 404 response");
      assert.equal("Not Found",data.message,"Error message should have been 'Not Found'");
      if(cont) {
        doLogout(token);
      } else if(onEnd) {
        onEnd();
      }
    });
  }
  // verify that we can logout
  var doLogout = (token) => {
    util.request.exec('DELETE','/auth?token='+token,null,(res)=>{
      var data = JSON.parse(res.body);
      assert.equal(200,res.statusCode,"Expected a 200 response");
      assert.equal(false,data.error,"Error flag false should have been returned");
      // and then, after logout, the original token is unfound
      doVerifyBad(token,false);
    });
  }
}


