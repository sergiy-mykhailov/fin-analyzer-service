const get = require('lodash/get');
const finAge = require('../apis/finage');
const { MARKET_TYPE } = require('../constants/market-data');
const Instrument = require('../models/instrument');

const refreshInstruments = async () => {
  const symbols = [];

  const instrumentsFirstPart = await finAge.getSymbolList(MARKET_TYPE.FOREX);
  symbols.push(...get(instrumentsFirstPart, 'symbols', []));

  if (instrumentsFirstPart.totalPage > 1) {
    const queries = [];
    for (let page = 2; page <= instrumentsFirstPart.totalPage; page++) {
      queries.push(finAge.getSymbolList(MARKET_TYPE.FOREX, page));
    }

    const instrumentsRest = await Promise.all(queries);
    instrumentsRest.forEach((result) => {
      symbols.push(...get(result, 'symbols', []));
    });
  }

  await Instrument.deleteAll();
  await Instrument.insert(symbols);

  return symbols;
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
