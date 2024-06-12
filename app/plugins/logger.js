const { isProd } = require('../config/env');

const prettyPrintProps = isProd
  ? {}
  : {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  };

module.exports = {
  plugin: require('hapi-pino'),
  options: {
    ignorePaths: ['/health'],
    logPayload: true,
    logRouteTags: true,
    ...prettyPrintProps,
  },
};
