const pino = require('pino');
const pretty = require('pino-pretty');
const { isProd } = require('../config/env');

const pinoOptions = {
  level: isProd ? 'info' : 'debug',
};

const logger = !isProd ? pino(pinoOptions, pretty({ colorize: true })) : pino(pinoOptions);

module.exports = logger;
