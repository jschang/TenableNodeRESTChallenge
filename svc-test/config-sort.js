const assert = require('assert');
const http = require('http');
const util = require('../util.js');
const stringify = require("querystring").stringify;

module.exports = function(onEnd) {
  util.request.exec('POST','/auth',{username:'jon',password:'fantastic'},
  (res) => {
    testFetchSorted(res,'username','asc',() => {
    testFetchSorted(res,'hostname','asc',() => {
    testFetchSorted(res,'name','asc',() => {
    testFetchSorted(res,'port','asc',() => {
    testFetchSorted(res,'username','desc',() => {
    testFetchSorted(res,'hostname','desc',() => {
    testFetchSorted(res,'name','desc',() => {
    testFetchSorted(res,'port','desc',() => {
    util.log('config-sort test passed');
    if(onEnd) onEnd();
  });});});});});});});});});
}

var testFetchSorted = (authRes,sort,dir,next)=>{
  var authData = JSON.parse(authRes.body);
  util.dbg('authData=',authData);
  var parms = {
    token:authData.token,
    sort:sort,
    dir:dir
  }
  util.request.exec('GET','/config?'+stringify(parms),null,(configRes)=>{
    assert.equal(200,configRes.statusCode);
    var configs = JSON.parse(configRes.body).configs;
    var last = configs.shift();
    last[sort] = sort!='port' ? last[sort].toLowerCase() : last[sort];
    for(var conf of configs) {
      conf[sort] = sort!='port' ? conf[sort].toLowerCase() : conf[sort];
      var sortedRight = false;
      if(dir == 'asc') {
        sortedRight = (last[sort] < conf[sort]);
      } else {
        sortedRight = (last[sort] > conf[sort]);
      }
      util.dbg('parms',[sort,dir]);
      util.dbg('comparing ',last[sort],' to ',conf[sort],' yielding ',sortedRight);
      assert(sortedRight)
      last = conf;
    }
    if(next) next();
  });
}

