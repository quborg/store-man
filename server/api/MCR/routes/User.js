'use strict'


var Router = require('express').Router()
  , passport  = require('passport')


module.exports = Controllers =>

  Router.get('/users', Controllers.getAll)
        .get('/user', Controllers.profile)
        .get('/user/:id', Controllers.findOne)
        .post('/user', Controllers.create)
        .post('/user/login', passport.authenticate('local'), Controllers.login)
        .get('/user/logout/:id', Controllers.logout)
        .put('/user/:id', Controllers.update)
        .delete('/user/:id', Controllers.destroy)
