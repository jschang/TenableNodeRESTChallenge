const assert = require('assert');
const http = require('http');
const util = require('../util.js');
const stringify = require("querystring").stringify;

util.request.exec('POST','/auth',{username:'jon',password:'fantastic'},(res) => {
testFetchSorted(res,'username','asc',3,2,() => {
testFetchSorted(res,'hostname','asc',3,2,() => {
testFetchSorted(res,'name','asc',3,2,() => {
testFetchSorted(res,'port','asc',3,2,() => {
testFetchSorted(res,'username','desc',3,2,() => {
testFetchSorted(res,'hostname','desc',3,2,() => {
testFetchSorted(res,'name','desc',3,2,() => {
testFetchSorted(res,'port','desc',3,2,() => {
});});});});});});});});});

var testFetchSorted = (authRes,sort,dir,start,count,next)=>{
  var authData = JSON.parse(authRes.body);
  util.dbg('authData=',authData);
  // validate that attemption to fetch will return an array of expected size
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

