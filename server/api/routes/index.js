'use strict';

var passport        = require('passport')
  , bodyParser      = require('body-parser')
  , cookieParser    = require('cookie-parser')
  , expressSession  = require('express-session')
  , LocalStrategy   = require('passport-local').Strategy
  , mongoose        = require('mongoose')
  , Models          = {
      // order : require('../models/Order'),
      user: require('../models/User'),
      client: require('../models/Client'),
      product: require('../models/Product')
    }
  , Routes          = {
      // order: require('./Order'),
      user: require('./User'),
      client: require('./Client'),
      product: require('./Product')
    }


module.exports = Server => {

  Server
    .use(function(req, res, next) {
      req.models = Models;
      next();
    })

    .use(bodyParser.urlencoded({limit: "50mb", extended:true}))
    .use(bodyParser.json({limit: "50mb"}))

    .use(cookieParser())
    .use(expressSession({
      secret: 'nou pagadi zayets !',
      resave: false,
      saveUninitialized: false
    }))
    .use(passport.initialize())
    .use(passport.session())

    .use('/*', function(req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
      res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
      res.header('Access-Control-Allow-Credentials', 'true');
      next();
     })

    .use('/api', Routes.user)
    .use('/api', Routes.client)
    .use('/api', Routes.product)
    // .use('/api', Routes.order)
  ;

  passport.use(new LocalStrategy(Models.user.authenticate()));
  passport.serializeUser(Models.user.serializeUser());
  passport.deserializeUser(Models.user.deserializeUser());

}
