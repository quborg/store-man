'use strict';


const ENTITIES      = [ 'user', 'client', 'product', 'bag', 'basket', 'order' ]
    , toCapitalize  = word => word.charAt(0).toUpperCase() + word.slice(1)
    , solveMCRPath  = (pattern, entity) => `../MCR/${pattern}/${toCapitalize(entity)}`

var passport        = require('passport')
  , bodyParser      = require('body-parser')
  , cookieParser    = require('cookie-parser')
  , expressSession  = require('express-session')
  , LocalStrategy   = require('passport-local').Strategy
  , mongoose        = require('mongoose')

  , Models = {}, Controllers = {}, Routes = {}
;


for (var i = 0; i < ENTITIES.length; i++) {
  var entity = ENTITIES[i]
  Models[entity]          = require(solveMCRPath('models', entity))
  Controllers[entity+'s'] = require(solveMCRPath('controllers', entity+'s'))
  Routes[entity]          = require(solveMCRPath('routes', entity)) (Controllers[entity+'s'])
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

    .use('/api', Routes.user, Routes.client, Routes.product, Routes.bag, Routes.basket, Routes.order)
  ;

  passport.use(new LocalStrategy(Models.user.authenticate()));
  passport.serializeUser(Models.user.serializeUser());
  passport.deserializeUser(Models.user.deserializeUser());

}
