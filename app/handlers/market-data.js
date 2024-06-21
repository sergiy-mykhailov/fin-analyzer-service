const dataProcessor = require('../services/market-data-collector');


const getMarketData = async (request) => {
  return dataProcessor.getMarketData(request.logger);
};

module.exports = {
  getMarketData,
};
