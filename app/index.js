const { start } = require('./server');
const logger = require('./utils/logger');

process.on('unhandledRejection', (error, promise) => {
  logger.error({ error, promise, stack: error.stack }, 'Unhandled rejection :(');

  process.exit(1);
});

start();
