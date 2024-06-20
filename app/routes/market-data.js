const { getMarketData } = require('../handlers/market-data');
const validatorRes = require('../validators/marketDataRes');

module.exports = [
  {
    method: 'GET',
    path: '/market-data',
    options: {
      handler: getMarketData,
      description: 'Gets market data',
      response: {
        failAction: 'log',
        status: {
          200: validatorRes.getMarketData,
        },
      },
    },
  },
];
