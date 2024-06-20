const dataProcessor = require('../services/market-data-collector');


const getAggregated = async () => {
  const aggregated = await dataProcessor.getAggregated();

  return aggregated;
};

module.exports = {
  refreshInstruments,
  getAggregated,
};
