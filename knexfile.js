const { knexSnakeCaseMappers } = require('objection');
const config = require('./app/constants/env');

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
    seeds: {
      directory: './seeds',
    },
    ...knexSnakeCaseMappers(),
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
    seeds: {
      directory: './seeds',
    },
  },
};
