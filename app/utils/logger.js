const pino = require('pino');
const pretty = require('pino-pretty');
const { isProd } = require('../constants/env');

const pinoOptions = {
  level: isProd ? 'info' : 'debug',
};

const logger = !isProd ? pino(pinoOptions, pretty({ colorize: true })) : pino(pinoOptions);

module.exports = logger;
