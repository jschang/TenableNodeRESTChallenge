const assert = require('assert');
const http = require('http');
const util = require('../util.js');
const stringify = require("querystring").stringify;

var newConfig = {
  name:"New Service",
  hostname:"vargus.jonschang.com",
  port:3543,
  username:"boondocks"
};
var existingConfig = {
  name:"Dancing Service",
  hostname:"samson.jonschang.com",
  port:3543,
  username:"fetidsocks"
};
var modifiedConfig = {
  name:"New Service",
  hostname:"vargus.jon-schang.com",
  port:6868,
  username:"tiggermandible"
}

module.exports = (onEnd) => {
util.request.exec('POST','/auth',{username:'jon',password:'fantastic'},(authRes) => {
var authData = JSON.parse(authRes.body);
util.dbg('authData=',authData); 
testFetchAll(authData,() => {
testCreateExisting(authData,() => {
testActualNew(authData,() => {
testFetchCreated(authData,() => {
testDeleteExisting(authData,() => {
testModifyExisting(authData,() => {
util.log('config test passed');
if(onEnd) onEnd();
});});});});});});});}

var testFetchAll = (authData,onEnd)=>{
  // validate that attemption to fetch will return an array of expected size
  util.request.exec('GET','/config?token='+authData.token,null,(configRes)=>{
    assert.equal(200,configRes.statusCode);
    assert.equal(5,JSON.parse(configRes.body).configs.length);
    // validate that attempting to fetch with a bad token will fail
    util.request.exec('GET','/config?token=badtoken',null,(configRes)=>{
      assert.equal(401,configRes.statusCode);
      assert.equal("Unauthorized",configRes.statusMessage);
      if(onEnd) onEnd();
    });
  });
}

// validate that attempting to create a new one will return 409
var testCreateExisting = (authData,onEnd)=> {
  util.request.exec('POST','/config?token='+authData.token,existingConfig,(configRes)=>{
    assert.equal(409,configRes.statusCode);
    assert.equal(true,JSON.parse(configRes.body).error);
    assert.equal("Conflict - Already exists",JSON.parse(configRes.body).message);
    if(onEnd) onEnd();
  });
}

// validate that a new one can be created
var testActualNew = (authData,onEnd)=>{
  util.request.exec('POST','/config?token='+authData.token,newConfig,(configRes)=>{
    assert.equal(200,configRes.statusCode);
    assert.equal(false,JSON.parse(configRes.body).error);
    // validate that attemption to fetch will return an array of expected size
    util.request.exec('GET','/config?token='+authData.token,null,(configRes)=>{
      assert.equal(200,configRes.statusCode);
      assert.equal(6,JSON.parse(configRes.body).configs.length);
      if(onEnd) onEnd();
    });
  });
}

// validate that we can fetch the new one we created
var testFetchCreated = (authData,onEnd)=> {
  // validate that attemption to fetch will return an array of expected size
  util.request.exec('GET','/config?'+stringify({token:authData.token,name:"Dancing Service"}),null,(configRes)=>{
    assert.equal(200,configRes.statusCode);
    var conf = JSON.parse(configRes.body)
    assert.deepEqual(existingConfig,conf);
    // validate that attemption to fetch will return an array of expected size
    util.request.exec('GET','/config?token='+authData.token,null,(configRes)=>{
      assert.equal(200,configRes.statusCode);
      assert.equal(6,JSON.parse(configRes.body).configs.length);
      if(onEnd) onEnd();
    });
  });
}

// validate that we can delete
var testDeleteExisting = (authData,onEnd)=>{
  util.request.exec('DELETE','/config?'+stringify({token:authData.token,name:"Dancing Service"}),null,(configRes)=>{
    assert.equal(200,configRes.statusCode);
    assert.equal(false,JSON.parse(configRes.body).error);
    // validate that attemption to fetch will return an array of expected size
    util.request.exec('GET','/config?token='+authData.token,null,(configRes)=>{
      assert.equal(200,configRes.statusCode);
      assert.equal(5,JSON.parse(configRes.body).configs.length);
      // validate that attemption to fetch will return an array of expected size
      util.request.exec('GET','/config?'+stringify({token:authData.token,name:"Dancing Service"}),null,(configRes)=>{
        assert.equal(404,configRes.statusCode);
        assert.equal(true,JSON.parse(configRes.body).error);
        if(onEnd) onEnd();
      });
    });
  });
}

// validate that we can modify a record
var testModifyExisting = (authData,onEnd)=>{
  util.request.exec('PATCH','/config?'+stringify({token:authData.token}),modifiedConfig,(configRes)=>{
    assert.equal(200,configRes.statusCode);
    assert.equal(false,JSON.parse(configRes.body).error);
    // validate that attemption to fetch will return an array of expected size
    util.request.exec('GET','/config?'+stringify({token:authData.token,name:"New Service"}),null,(fetchRes)=>{
      var conf = JSON.parse(fetchRes.body)
      assert.equal(200,fetchRes.statusCode);
      assert.deepEqual(modifiedConfig,conf);
      if(onEnd) onEnd();
    });
  });
}


