const dataProcessor = require('../services/market-data-processor');

const refreshInstruments = async () => {
  const instruments = await dataProcessor.refreshInstruments();

  return instruments;
};

const getAggregated = async () => {
  const aggregated = await dataProcessor.getAggregated();

  return aggregated;
};

module.exports = {
  refreshInstruments,
  getAggregated,
};
