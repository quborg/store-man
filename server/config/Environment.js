'use strict'

const DB_DEV_URL  = "mongodb://localhost/fermeayla_dev"
    , DB_PROD_URL = "mongodb://localhost/fermeayla"


module.exports = Server => {

  let ENV = process.env.NODE_ENV
    , PORT = process.env.PORT
    , DB_URL = ENV == 'production'
                ? DB_PROD_URL
                : DB_DEV_URL


  Server.mode   = ENV  || 'development';
  Server.port   = PORT || '3000';
  Server.db_url = DB_URL;

}
