const util = require('../../util.js');
const model = require('./model.js');

module.exports = util.auth.wrap((req,res)=>{ 
  util.dbg('entering /config/fetch')
  var query = require('url').parse(req.url,true).query;
  if(query.name) {
    model.fetch(query.name,(data)=>{
      if(data) {
        res.writeHead(200,{'Content-Type':'application/json'});
        res.end(JSON.stringify(data))
      } else {
        req.emit('error', new util.request.error(404,'Not Found'));
      }
    });
  } else {
    var start = query.start ? query.start : '0';
    var count = query.count ? query.count : '0';
    if(!start.match(/[0-9]+/) || !count.match(/[0-9]+/)) {
      req.emit('error',util.request.error(400,'Both start and count parameters must be numbers'));
      return;
    }
    start = Math.floor(start);
    count = Math.floor(count);
    model.fetchAll(query.sort,query.dir,start,count,(data)=>{
      if(data) {
        res.writeHead(200,{'Content-Type':'application/json'});
        res.end(JSON.stringify({configs:data}))
      } else {
        req.emit('error', new util.request.error(404,'Not Found'));
      }
    });
  }
});
