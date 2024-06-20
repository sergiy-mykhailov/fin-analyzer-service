const Joi = require('joi');

const getMarketData = Joi.object({
  candles: Joi.array(),
  ticks: Joi.array(),
});

module.exports = {
  getMarketData,
};
