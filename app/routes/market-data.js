const Joi = require('joi');
const { refreshInstruments, getAggregated } = require('../handlers/market-data');
const validatorRes = require('../validators/response');

module.exports = [
  {
    method: 'GET',
    path: '/market-data/aggregated',
    options: {
      handler: getAggregated,
      description: 'Gets aggregated market data',
      response: {
        failAction: 'log',
        status: {
          200: Joi.string(),
        },
      },
    },
  },
];
