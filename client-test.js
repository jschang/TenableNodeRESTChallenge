var util = require('./util.js');
var authTest = require('./svc-test/auth.js');
var configTest = require('./svc-test/config.js');
var configSortTest = require('./svc-test/config-sort.js');
var configPaginateTest = require('./svc-test/config-paginate.js');

authTest(()=>{
//configTest(()=>{
configSortTest(()=>{
configPaginateTest(()=>{
util.log('HOORAY!');
});});});//});

