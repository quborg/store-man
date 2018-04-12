'use strict'


var ENV = process.env.NODE_ENV || 'development'

module.exports = require(`./configure-store.${ENV}`)
