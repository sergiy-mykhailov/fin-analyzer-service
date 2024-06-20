const { get, keyBy, isEmpty, first, last, uniq } = require('lodash');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const finAge = require('../apis/finage');
const Instrument = require('../models/instrument');
const Candle = require('../models/candle');
const Tick = require('../models/tick');

dayjs.extend(utc);

const getInstruments = async () => {
  const instruments = await Instrument.findAll();

  const symbolToInstrument = keyBy(instruments, 'symbol');

  return { instruments, symbolToInstrument };
};

const getAggregates = async (instruments, symbolToInstrument) => {
  const date = dayjs().utc();
  const from = date.format('YYYY-MM-DD');
  const to = from;
  // const limit = 20;
  // const st = date.subtract(5, 'hour').format('HH:mm');
  // const et = date.format('HH:mm');

  const data = await Promise.all(
    instruments.map((instrument) =>
      finAge.getAggregates({ symbol: instrument.symbol, from, to }),
    ),
  );

  const candles = [];
  const instrumentIds = [];
  data.forEach((item) => {
    if (isEmpty(item.results)) return;

    item.results.forEach((candle) => {
      const instrumentId = get(symbolToInstrument, [item.symbol, 'id']);
      if (!instrumentId) return;

      instrumentIds.push(instrumentId);
      candles.push({
        instrumentId,
        timestamp: new Date(candle.t),
        open: candle.o,
        close: candle.c,
        high: candle.h,
        low: candle.l,
        volume: candle.v,
      });
    });
  });

  return { candles, instrumentIds: uniq(instrumentIds) };
};

const saveCandles = async (candles, instrumentIds) => {
  if (isEmpty(candles)) return;

  const maxDate = first(candles).timestamp;
  const minDate = last(candles).timestamp;

  await Candle.deleteByInstrumentIdsInDateRange(instrumentIds, minDate, maxDate);
  await Candle.insert(candles);
};

const getTicks = async (instruments, symbolToInstrument) => {
  const date = dayjs().utc().format('YYYY-MM-DD');
  // const limit = 20;

  const data = await Promise.all(
    instruments.map((instrument) =>
      finAge.getTicks({ symbol: instrument.symbol, date }),
    ),
  );

  const ticks = [];
  const instrumentIds = [];
  data.forEach((item) => {
    if (isEmpty(item.ticks)) return;

    item.ticks.forEach((tick) => {
      const instrumentId = get(symbolToInstrument, [item.symbol, 'id']);
      if (!instrumentId) return;

      instrumentIds.push(instrumentId);
      ticks.push({
        instrumentId,
        date: new Date(item.date),
        timestamp: new Date(tick.t),
        price: tick.b, // Bid price
      });
    });
  });

  return { ticks, instrumentIds: uniq(instrumentIds), date };
};

const saveTicks = async (candles, instrumentIds, date) => {
  if (isEmpty(candles)) return;

  await Tick.deleteByInstrumentIdsAndDate(instrumentIds, date);
  await Tick.insert(candles);
};

const getMarketData = async () => {
  const { instruments, symbolToInstrument } = await getInstruments();
  if (isEmpty(instruments)) return [];

  const [
    { candles, instrumentIds: candleInstrumentIds },
    { ticks, instrumentIds: tickInstrumentIds, date },
  ] = await Promise.all([
    getAggregates(instruments, symbolToInstrument),
    getTicks(instruments, symbolToInstrument),
  ]);

  await Promise.all([
    saveCandles(candles, candleInstrumentIds),
    saveTicks(ticks, tickInstrumentIds, date),
  ]);

  //TODO: transactions for save methods
  //TODO: log instead of throw for api

  return { candles, ticks };
};

module.exports = {
  getMarketData,
};
