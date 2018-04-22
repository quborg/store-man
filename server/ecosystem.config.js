module.exports = {
  apps : [
      {
        "name": "api-ferme-ayla",
        "script": "./index.js",
        "max_restarts": 2,
        "watch": ["./api/"],
        "env": {
            "PORT": 3031,
            "NODE_ENV": "development",
        },
        "env_production": {
            "PORT": 8081,
            "NODE_ENV": "production",
        },
        "out_file": "./logs/api.stdout.log",
        "error_file": "./logs/api.stderr.log"
      },
      {
        "name": "mongo-db",
        "script": "./services/mongod.sh",
        "max_restarts": 2,
        "watch": ["./api/models/"],
        "out_file": "./logs/mongodb.stdout.log",
        "error_file": "./logs/mongodb.stderr.log"
      }
  ]
}
