const marketDataCollector = require('../services/market-data-collector');

module.exports = [
  {
    cronTime: '0 * * * * *',
    getHandler: (server) => async () => {
      server.logger.info('Cron job started: getting candles...');
      return marketDataCollector.getCandles(server.logger);
    },
  },
  {
    cronTime: '*/10 * * * * *',
    getHandler: (server) => async () => {
      server.logger.info('Cron job started: getting ticks...');
      return marketDataCollector.getTicks(server.logger);
    },
  },
];
