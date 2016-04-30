Tenable REST API Challenge
==========================

Here we have my implementation of a Node.js REST api
challenge offered by Tenable Network Security. 

To Evaluate
===========

Kick off the server, which runs on 127.0.0.1:13337 by default 

    $ node server.js  
  
then run the tests (in a separate terminal)

    $ node client-test.js  

The Challenge
=============

**Using Node (and only Node) create a web service with a REST API with 
routes that:**

  _1) Allow a user to login_
  
    POST /auth
    
Request body:

    {username:_username_,password:_password_}

Response body: 

    {token:_token_}
    
  _2) Allow a user to logout_
  
    DELETE /auth?token={token}
    
Removes the session token, effectively ending the user's login.
Responds with either a 200 or 404, if the session is not found.
  
  _3) Mine...allow auth checks from the config microservice_
    
    GET /auth?token={token}
    
Responds with either a 200 or 404, if the session is not found.

**Building on the previous question, use Node (and only Node) to create a REST 
compliant API with routes that allow an authenticated user to:**

  _1) Retrieve server configurations as JSON data (using the below as a sample)_
  
    GET /config?token={token} 
    
responds with all configs
    
    GET /config?token={token}&name={verboseName} 
    
responds with a single config

  _2) Create configurations_
  
    POST /config?token={token}
    
Post body:

    {
      name:_name_,
      hostname:_hostname_,
      port:_port_,
      username:_username_
    }

Responds with a 409 if you try to create a pre-existing name.
    
  _3) Delete configurations_
  
  DELETE /auth?token={token}&name=_urlEncodedVerboseName_
  
  _4) Modify configurations_
  
  PATCH /auth?token={token}&name=_urlEncodedVerboseName_
  
Post body:

    {
      name:_name_,
      hostname:_modifiedHostname_,
      port:_modifiedPort_,
      username:_modifiedUsername_
    }

**Building on the previous question, use Node (and only Node) to modify your 
REST compliant API routes to support:**

  _1) Sorting by name, hostname, port, or username_
  
_yet to be completed_
  
  _2) Pagination (you will need to randomize and expand the confgiurations for this)_
  
_yet to be completed_

Standard Responses
------------------

Unless mentioned above, the 200 response body for all requests is the same

Response body:

    {error:false}

For all error codes, the response body is:

    {error:true,message:_wtfhappened_}
  
Implementation Notes
--------------------

As this is vanilla-node, the datasources are just in _svc/auth/data.js_ and
_svc/config/data.js_.  The only way they are interacted with is via the _model.js_.
I could have gone with writing/reading json files, but I didn't.

This is in the spirit of microservices, so I extended the /auth api to
allow for a session verification endpoint, which is used by the /config endpoint.

There is a custom router implementation in util/router.js, which can handle
pathing of arbitrary depth and allows the request method to be specified.
The root of routing is svc/routes.js

Also, to be noted, this impl is served HTTP in plain-text...horribly insecure.
My excuse for letting it slide is that it would most likely be running on HTTPS 
in the wild.

Names are evaluated in a case-sensitive manner, with the exception of sorting.

Known Issue
-----------

I was unable to figure out a good way to handle a particular server crash.
If you post something that's not a standard request method (UPDATE, for example)
then the server completely barfs.  I'll be trying to fix it once I complete
the requirements.


