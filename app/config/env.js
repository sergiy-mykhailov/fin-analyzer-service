const { NODE_ENV_PRODUCTION } = require('../constants/common');

module.exports = {
  isProd: process.env.NODE_ENV === NODE_ENV_PRODUCTION,
  service: {
    host: process.env.SERVICE_HOST,
    port: process.env.SERVICE_PORT,
  },
  db: {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_NAME,
  },
};
