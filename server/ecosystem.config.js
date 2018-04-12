module.exports = {
  apps : [
      {
        name: "ferme-ayla",
        script: "./index.js",
        watch: true,
        env: {
            "PORT": 3031,
            "NODE_ENV": "development",
        },
        env_production: {
            "PORT": 8081,
            "NODE_ENV": "production",
        },
      }
  ]
}
