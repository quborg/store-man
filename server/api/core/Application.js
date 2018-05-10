'use strict'

/**
 * APPLICATION SERVER DISPATCHER
 */

module.exports = Server => {

  require('./Environment')(Server)

  require('./Server')(Server)

  require('./Connection')(Server)

}
