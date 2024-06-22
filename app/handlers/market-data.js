const marketDataCollector = require('../services/market-data-collector');

const getCandles = async (request) => {
  return marketDataCollector.getCandles(request.logger);
};

const getTicks = async (request) => {
  return marketDataCollector.getTicks(request.logger);
};

module.exports = {
  getCandles,
  getTicks,
};
