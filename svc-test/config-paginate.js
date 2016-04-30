const assert = require('assert');
const http = require('http');
const util = require('../util.js');
const stringify = require("querystring").stringify;

module.exports = (onEnd) => {    
  util.request.exec('POST','/auth',{username:'jon',password:'fantastic'},(res) => {
  // fetch the current state of the configs data
  testFetchSorted(res,'name','asc','','',(allConfigs) => {
      util.dbg('all configs: ',allConfigs);
  // request a few from anywhere in the middle
  testFetchSorted(res,'name','asc',2,2,(configs) => {
      assert.equal(2,configs.length)
      // validate that they are the two they should be
      assert.equal(allConfigs[2].name,configs[0].name);
      assert.equal(allConfigs[3].name,configs[1].name);
  // request more than we have at the end, but including
  testFetchSorted(res,'name','asc',allConfigs.length-1,2,(configs) => {
      assert.equal(1,configs.length)
      // validate that they are the two they should be
      assert.equal(allConfigs[allConfigs.length-1].name,configs[0].name);
  // request a window beyond the end
  testFetchSorted(res,'name','asc',allConfigs.length+1,2,(configs) => {
      assert.equal(0,configs.length)
  // request the very beginning
  testFetchSorted(res,'name','asc',0,2,(configs) => {
      assert.equal(2,configs.length)
      // validate that they are the two they should be
      assert.equal(allConfigs[0].name,configs[0].name);
      assert.equal(allConfigs[1].name,configs[1].name);
  util.log('config-paginate test passed');
  if(onEnd) onEnd();
  });});});});});});
}

var testFetchSorted = (authRes,sort,dir,start,count,onEnd)=>{
  var authData = JSON.parse(authRes.body);
  util.dbg('authData=',authData);
  var parms = {
    token:authData.token,
    sort:sort,
    dir:dir,
    start:start,
    count:count
  }
  util.request.exec('GET','/config?'+stringify(parms),null,(configRes)=>{
    assert.equal(200,configRes.statusCode);
    var configs = JSON.parse(configRes.body).configs;
    var last = null;
    if(configs.length) {
      for(var conf of configs) {
        if(last===null) {
          continue;
        } 
        var left = sort!='port' ? last[sort].toLowerCase() : last[sort];
        var right = sort!='port' ? conf[sort].toLowerCase() : conf[sort];
        var sortedRight = false;
        if(dir == 'asc') {
          sortedRight = (left < right);
        } else {
          sortedRight = (left > right);
        }
        util.dbg('parms',[sort,dir]);
        util.dbg('comparing ',last[sort],' to ',conf[sort],' yielding ',sortedRight);
        assert(sortedRight)
        last = conf;
      }
    }
    if(onEnd) onEnd(configs);
  });
}
