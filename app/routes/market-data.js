const { getCandles, getTicks } = require('../handlers/market-data');
const validatorRes = require('../validators/marketDataRes');

module.exports = [
  {
    method: 'GET',
    path: '/market-data/candle',
    options: {
      handler: getCandles,
      description: 'Gets candle data',
      response: {
        failAction: 'log',
        status: {
          200: validatorRes.getMarketData,
        },
      },
    },
  },
  {
    method: 'GET',
    path: '/market-data/tick',
    options: {
      handler: getTicks,
      description: 'Gets tick data',
      response: {
        failAction: 'log',
        status: {
          200: validatorRes.getMarketData,
        },
      },
    },
  },
];
