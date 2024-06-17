const Joi = require('joi');
const { refreshInstruments, getAggregated } = require('../handlers/market-data');
const validatorRes = require('../validators/response');

module.exports = [
  {
    method: 'POST',
    path: '/market-data/instruments',
    options: {
      handler: refreshInstruments,
      description: 'Gets and stores a list of instruments from the market API',
      response: {
        failAction: 'log',
        status: {
          204: validatorRes.noContent,
        },
      },
    },
  },
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
