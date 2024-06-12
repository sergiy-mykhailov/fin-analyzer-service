const { NODE_ENV_PRODUCTION } = require('../constants/common');

module.exports = {
  isProd: process.env.NODE_ENV === NODE_ENV_PRODUCTION,
  service: {
    host: process.env.SERVICE_HOST,
    port: process.env.SERVICE_PORT,
  },
};
