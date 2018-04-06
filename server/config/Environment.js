'use strict'

var config =  {
                development: {
                  mode: 'development',
                  db_url: 'mongodb://localhost/fermeayla_dev',
                  port: 3031
                },
                production: {
                  mode: 'production',
                  db_url: 'mongodb://localhost/fermeayla',
                  port: 8081
                }
              }
  , DEFAULT_ENV = config.development.mode



module.exports = Server => {

  let ENV = process.argv[2] || DEFAULT_ENV
    , appConfig = config[ENV]

  Server.mode    = appConfig.mode;
  Server.db_url  = appConfig.db_url;
  Server.port    = appConfig.port;

}
