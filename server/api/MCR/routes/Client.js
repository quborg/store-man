'use strict'


var Router = require('express').Router()



module.exports = Controllers =>

  Router.get('/clients', Controllers.getAll)
        .get('/client/:id', Controllers.findOne)
        .post('/client', Controllers.create)
        .put('/client/:id', Controllers.update)
        .delete('/client/:id', Controllers.destroy)
