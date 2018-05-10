'use strict'

/**
 * MONGODB CONNECTION
 * OPEN STATE EVENT EMITTER
 */

var mongoose = require('mongoose')

mongoose.Promise = global.Promise


module.exports = ({db_url, conn_options, ...Server}) => {

  mongoose.connect(db_url, conn_options)
    .then(() =>  console.log('connection succesful'))
    .catch((err) => console.error(err));

  mongoose.connection.once('open', function() {
    Server.emit('ready')
  })

}
