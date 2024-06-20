const dataProcessor = require('../services/market-data-collector');


const getMarketData = async () => {
  return dataProcessor.getMarketData();
};

module.exports = {
  getMarketData,
};
