var routes = require('../svc/routes.js');
var util = require('../util.js');

module.exports = {
  determine:(req,res) => {
    try {
      // get the path for routing
      var path = require('url').parse(req.url).pathname.split('/').splice(1);
      util.log('request url:',req.url);
      util.log('request method:',req.method);
      util.log('request path: ',path);
      if(!req.method.match(/^PUT|DELETE|PATCH|GET|POST$/i)) {
        req.emit('error',new util.request.error(405,"Method Not Allowed - ",req.method));
        return;
      }
      // route to the particulr request handler
      var route = routes;
      for(var pathPart of path) {
        if(route.paths[pathPart]) {
          route = route.paths[pathPart];
        } else {
          req.emit('error',new util.request.error(404,"Not Found"));
          return;
        }
      }
      if(typeof(route)!='function' && route.methods[req.method]) {
        route = route.methods[req.method];
      }
      if(typeof(route)!='function') {
        req.emit('error',new util.request.error(404,"Not Found"));
        return;
      }
      return route;
    } catch(e) {
      req.emit('error',new util.request.error(500,'Unable to establish route'));
      return;
    }
  }
}
