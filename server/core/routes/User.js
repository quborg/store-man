'use strict'


var Router = require('express').Router()
  , passport  = require('passport')
  , Controllers = {
      Users: require('../controllers/Users')
    }


Router.get('/users', Controllers.Users.getAll)
      .get('/user', Controllers.Users.profile)
      .get('/user/:_id', Controllers.Users.findOne)
      .post('/user', Controllers.Users.create)
      .post('/user/login', passport.authenticate('local'), Controllers.Users.login)
      .get('/user/logout', Controllers.Users.logout)
      .put('/user/:_id', Controllers.Users.update)
      .delete('/user/:_id', Controllers.Users.destroy)



module.exports = Router
