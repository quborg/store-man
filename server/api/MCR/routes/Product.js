'use strict'


var Router = require('express').Router()



module.exports = Controllers =>

  Router.get('/products', Controllers.getAll)
        .get('/product/:id', Controllers.findOne)
        .post('/product', Controllers.create)
        .put('/product/:id', Controllers.update)
        .delete('/product/:id', Controllers.destroy)
