const http = require('http');
const util = require('./util.js');
const router = require('./util/router.js');
const sharedConfig = require('./shared-config')

var responseCodes = {
    404:'HTTP/1.1 404 Not Found\r\n\r\n',
    400:'HTTP/1.1 400 Bad Request\r\n\r\n',
    500:'HTTP/1.1 500 Server Error\r\n\r\n',
}

const server = http.createServer((req,res)=>{
  // if we find a route, then execute it,
  // elsewise response is 404
  var route = router.determine(req,res);
  if(!route) return;
  
  req.on('error', function(e) {
    util.request.handleServerError(req,res,e);
  });
  res.on('error', function(e) {
    util.request.handleServerError(req,res,e);
  });
  
  // accumulate the request body
  var body = [];
  req.on('data', function(chunk) {
    // TODO: check max request size
    body.push(chunk);
  })
  // once we have it all, then fire the request handler
  req.on('end', function() {
      try {
        body = Buffer.concat(body).toString();
        req.body = body;
        // once we have the whole body,
        // then fire off the handler
        // should all be fairly small json payloads
        route(req,res)
      } catch(e) {
        util.request.handleServerError(req,res,e);
      }
  });
}).listen(sharedConfig.api.port,sharedConfig.api.host);

server.on('clientError', (err, socket) => {
  util.log('clientError: ',err);
  socket.end(responseCodes[400]);
});

