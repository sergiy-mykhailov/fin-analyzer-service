const config = require('./app/config/env');

module.exports = {
  development: {
    client: 'postgresql',
    useNullAsDefault: true,
    connection: {
      host: config.db.host,
      port: config.db.port,
      database: config.db.database,
      user: config.db.user,
      password: config.db.password,
    },
    pool: {
      min: 0,
      max: 10,
    },
    migrations: {
      tableName: 'migrations',
    },
  },
  cli: {
    client: 'postgresql',
    connection: {
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
    },
    migrations: {
      tableName: 'migrations',
    },
  },
};
