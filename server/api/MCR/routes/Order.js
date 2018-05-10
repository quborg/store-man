'use strict'


var Router = require('express').Router()



module.exports = Controllers =>

  Router.get('/orders', Controllers.getAll)
        .get('/order/:id', Controllers.findOne)
        .post('/order', Controllers.create)
        .put('/order/:id', Controllers.update)
        .delete('/order/:id', Controllers.destroy)
