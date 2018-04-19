'use strict'


var Router      = require('express').Router()
  , Controllers = {
      Products: require('../controllers/Products')
    }


Router.get('/products', Controllers.Products.getAll)
      .get('/product/:id', Controllers.Products.findOne)
      .post('/product', Controllers.Products.create)
      .put('/product/:id', Controllers.Products.update)
      .delete('/product/:id', Controllers.Products.destroy)



module.exports = Router
