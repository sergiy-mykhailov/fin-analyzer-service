const dataProcessor = require('../services/market-data-processor');

const refreshInstruments = async (request, h) => {
  await dataProcessor.refreshInstruments();

  return h.code(204);
};

const getAggregated = async () => {
  const aggregated = await dataProcessor.getAggregated();

  return aggregated;
};

module.exports = {
  refreshInstruments,
  getAggregated,
};
