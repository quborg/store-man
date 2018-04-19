'use strict'

module.exports = Server => {

  require('./Environment')(Server)

  require('../routes')(Server)

  require('./Connection')(Server)

}
