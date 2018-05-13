module.exports = {
  apps : [
      {
        "name": "mongo-db",
        "script": "./services/mongod.sh",
        "max_restarts": 2,
        "watch": ["./api/models/"],
        "out_file": "./logs/mongodb.stdout.log",
        "error_file": "./logs/mongodb.stderr.log"
      },
      {
        "name": "api-ferme-ayla-dev",
        "script": "./index.js",
        "max_restarts": 2,
        "watch": ["./api/"],
        "env": {
            "PORT": 3031,
            "NODE_ENV": "development",
        },
        "out_file": "./logs/api-dev.stdout.log",
        "error_file": "./logs/api-dev.stderr.log"
      },
      {
        "name": "api-ferme-ayla-prod",
        "script": "./index.js",
        "max_restarts": 2,
        "env": {
            "PORT": 8081,
            "NODE_ENV": "production",
        },
        "out_file": "./logs/api-prod.stdout.log",
        "error_file": "./logs/api-prod.stderr.log"
      }
  ]
}
