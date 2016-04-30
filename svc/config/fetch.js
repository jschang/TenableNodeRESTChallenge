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
    model.fetchAll((data)=>{
      if(data) {
        res.writeHead(200,{'Content-Type':'application/json'});
        res.end(JSON.stringify(data))
      } else {
        req.emit('error', new util.request.error(404,'Not Found'));
      }
    });
  }
});
