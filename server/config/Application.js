'use strict'

module.exports = Server => {

  require('./Environment')(Server)

  require('../core/routes')(Server)

  require('./Connection')(Server.db_url)

}
