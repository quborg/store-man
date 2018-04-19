'use strict';


require('app-module-path').addPath(__dirname)

var Express = require('express')
, Server  = Express()

require('./api/core/Application')(Server)



const log_args =  [
                    'API: mode %s, @port %s, %s.',
                    Server.mode,
                    Server.port,
                    Server.db_url
                  ]

Server.on('ready', function() {
  Server.listen(Server.port, console.log(...log_args))
});
