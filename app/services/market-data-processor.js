const finAge = require('../apis/finage');
const { MARKET_TYPE } = require('../constants/market-data');

const refreshInstruments = async () => {
  const instruments = await finAge.getSymbolList(MARKET_TYPE.FOREX);
  // TODO: before save new instrument - delete old
  // TODO: save instruments to the database
  // TODO: if instruments.totalPage > 1 -> get and save rest instruments
  // TODO add model for instruments

  return instruments;
};

const getAggregated = async () => {
  const symbol = 'EURUSD';
  const multiply = '1';
  const time = 'minute'; // minute, hour, day, week, month, quarter, year
  const from = '2024-06-12';
  const to = '2024-06-12';
  // const limit = 20; // Maximum allowed limit is 20 for free API subscriptions.

  const aggregated = await finAge.getAggregated({ symbol, multiply, time, from, to });

  // TODO add model for candles

  return aggregated;
};

module.exports = {
  refreshInstruments,
  getAggregated,
};
