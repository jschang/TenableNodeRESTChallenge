const util = require('../../util.js');
const model = require('./model.js');

const sortify = (query,data) => {
  if(query.sort && query.sort.match(/^hostname|username|port|name$/i)) {
    var sort = query.sort.toLowerCase();
    var dir = 'asc'
    if(query.dir && query.dir.match(/^asc|desc$/i)) {
      dir = query.dir.toLowerCase();
    }
    data.sort(function(a,b) {
        var left = dir == 'asc' ? a[sort] : b[sort];
        var right = dir == 'asc' ? b[sort] : a[sort];
        if(typeof(left[sort])=='string' 
            || typeof(right[sort])=='string') {
          left = left.toLowerCase();
          right = right.toLowerCase();
        } 
        if( left < right ) {
          return -1
        } else if( left > right ){
          return 1;
        }
        return 0;
    });
  }
}

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
        sortify(query,data);
        res.end(JSON.stringify({configs:data}))
      } else {
        req.emit('error', new util.request.error(404,'Not Found'));
      }
    });
  }
});
