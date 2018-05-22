'use strict'


var Router = require('express').Router()



module.exports = Controllers =>

  Router.get('/baskets', Controllers.getAll)
        .get('/basket/:id', Controllers.findOne)
        .post('/basket', Controllers.create)
        .put('/basket/:id/:name', Controllers.update)
        .delete('/basket/:id', Controllers.destroy)
