'use strict'

var Router = require('express').Router()
  , Controllers = {
      Orders: require('../controllers/Orders')
    }

Router.get('/orders', Controllers.Orders.getAll)
      .get('/order/:id', Controllers.Orders.findOne)
      .post('/order', Controllers.Orders.create)
      .put('/order/:id', Controllers.Orders.update)
      .delete('/order/:id', Controllers.Orders.destroy)

module.exports = Router
