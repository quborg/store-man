'use strict'

/**
 * ENVIRENMENT CONFIGURATION
 */

const DB_DEV_URL  = "mongodb://localhost/storeman_dev"
    , DB_PROD_URL = "mongodb://localhost/storeman"
    , OPTIONS     = {
                      server:   { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
                      replset:  { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }
                    };

module.exports = Server => {

  let ENV = process.env.NODE_ENV
    , PORT = process.env.PORT
    , DB_URL = ENV == 'production'
                ? DB_PROD_URL
                : DB_DEV_URL


  Server.mode   = ENV  || 'development';
  Server.port   = PORT || '3031';
  Server.db_url = DB_URL;
  Server.conn_options = OPTIONS

}
