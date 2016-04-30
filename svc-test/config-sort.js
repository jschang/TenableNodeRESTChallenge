const assert = require('assert');
const http = require('http');
const util = require('../util.js');
const stringify = require("querystring").stringify;

util.request.exec('POST','/auth',{username:'jon',password:'fantastic'},(res) => {
testFetchSorted(res,'username','asc',() => {
testFetchSorted(res,'hostname','asc',() => {
testFetchSorted(res,'name','asc',() => {
testFetchSorted(res,'port','asc',() => {
testFetchSorted(res,'username','desc',() => {
testFetchSorted(res,'hostname','desc',() => {
testFetchSorted(res,'name','desc',() => {
testFetchSorted(res,'port','desc',() => {
});});});});});});});});});

var testFetchSorted = (authRes,sort,dir,next)=>{
  var authData = JSON.parse(authRes.body);
  util.dbg('authData=',authData);
  // validate that attemption to fetch will return an array of expected size
  var parms = {
    token:authData.token,
    sort:sort,
    dir:dir
  }
  util.request.exec('GET','/config?'+stringify(parms),null,(configRes)=>{
    assert.equal(200,configRes.statusCode);
    var configs = JSON.parse(configRes.body).configs;
    var last = configs.shift();
    for(var conf of configs) {
      util.log('comparing ',last[sort],' to ',conf[sort]);
      assert(
        dir == 'asc'
        ? (
          sort!='port' 
          ? (conf[sort].toLowerCase() < last[sort].toLowerCase())
          : (conf[sort] < last[sort])
        )
        : (
          sort!='port' 
          ? (conf[sort].toLowerCase() > last[sort].toLowerCase())
          : (conf[sort] > last[sort])
        )
      );
      last = conf;
    }
    if(next) next();
  });
}

