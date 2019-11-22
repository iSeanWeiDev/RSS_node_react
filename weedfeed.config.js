module.exports = {
  apps: [{
    name: "weedfeed-server",
    script: "node index.js",
    watch: true,
    env: {
      "NODE_ENV": "development",
    },
    env_production: {
      "NODE_ENV": "production"
    }
  },
  {
    name: "weedfeed-client",
    script: "cd client && npm start",
    watch: true,
    env: {
      "NODE_ENV": "development",
    },
    env_production: {
      "NODE_ENV": "production"
    }
  }]
}
