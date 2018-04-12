'use strict'


var Router      = require('express').Router()
  , Controllers = {
      Clients: require('../controllers/Clients')
    }


Router.get('/clients', Controllers.Clients.getAll)
      .get('/client/:_id', Controllers.Clients.findOne)
      .post('/client', Controllers.Clients.create)
      .put('/client/:_id', Controllers.Clients.update)
      .delete('/client/:_id', Controllers.Clients.destroy)



module.exports = Router
