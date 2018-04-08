'use strict';

var Express = require('express')
  , Server  = Express()


require('./config/Application')(Server)




Server.listen(Server.port, console.log('Server: mode %s, @port %s, %s.',Server.mode, Server.port, Server.db_url))
