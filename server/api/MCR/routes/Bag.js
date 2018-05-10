'use strict'


var Router = require('express').Router()



module.exports = Controllers =>

  Router.get('/bags', Controllers.getAll)
        .get('/bag/:id', Controllers.findOne)
        .post('/bag', Controllers.create)
        .put('/bag/:id', Controllers.update)
        .delete('/bag/:id', Controllers.destroy)
