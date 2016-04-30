const util = require('../../util.js');
const model = require('./model.js');

module.exports = util.auth.wrap((req,res)=>{ 
  util.dbg('entering /config/delete')
  var query = require('url').parse(req.url,true).query;
  if(!query.name) {
    req.emit('error',util.request.error(400,"'name' is required for DELETE operations"));
    return;
  }
  model.fetch(query.name,(data)=>{
    if(data) {
      model.delete(data,(success)=>{
        if(!success) {
          req.emit('error',new util.request.error(500,'Server Error - unable to delete record'));
        } else {
          res.writeHead(200,{'Content-Type':'application/json'});
          res.end(JSON.stringify({error:false}))
        }
      })
    } else {
      req.emit('error',new util.request.error(404,'Not Found'));
    }
  });
});

