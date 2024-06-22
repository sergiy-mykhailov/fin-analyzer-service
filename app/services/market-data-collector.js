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

const getAndPrepareAggregates = async (instruments, symbolToInstrument, logger) => {
  const date = dayjs().utc();
  const from = date.format('YYYY-MM-DD');
  const to = from;
  // TODO: check parapeters:
  // const limit = 20;
  // const st = date.subtract(5, 'hour').format('HH:mm');
  // const et = date.format('HH:mm');

  const data = await Promise.all(
    instruments.map((instrument) =>
      finAge.getAggregates({ symbol: instrument.symbol, from, to }, logger),
    ),
  );

  const candles = [];
  const instrumentIds = [];
  data.forEach((item) => {
    const result = get(item, 'results', []);

    if (isEmpty(result) || !Array.isArray(result)) return;

    result.forEach((candle) => {
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

const saveCandles = async (candles, instrumentIds, logger) => {
  if (isEmpty(candles)) return;

  const from = first(candles).timestamp;
  const to = last(candles).timestamp;

  const trx = await Candle.transaction();

  try {
    await Candle.deleteByInstrumentIdsInDateRange(instrumentIds, { from, to }, trx);
    await Candle.insert(candles, trx);

    await trx.commit();
  } catch (err) {
    logger.error(err);
    await trx.rollback();
  }
};

const getAndPrepareTicks = async (instruments, symbolToInstrument, logger) => {
  const date = dayjs().utc().format('YYYY-MM-DD');
  // TODO: check parapeters:
  // const limit = 20;

  const data = await Promise.all(
    instruments.map((instrument) =>
      finAge.getTicks({ symbol: instrument.symbol, date }, logger),
    ),
  );

  const ticks = [];
  const instrumentIds = [];
  data.forEach((item) => {
    const result = get(item, 'ticks', []);

    if (isEmpty(result) || !Array.isArray(result)) return;

    result.forEach((tick) => {
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

  return { ticks, instrumentIds: uniq(instrumentIds) };
};

const saveTicks = async (ticks, instrumentIds, logger) => {
  if (isEmpty(ticks)) return;

  const from = first(ticks).timestamp;
  const to = last(ticks).timestamp;

  const trx = await Tick.transaction();

  try {
    await Tick.deleteByInstrumentIdsInDateRange(instrumentIds, { from, to }, trx);
    await Tick.insert(ticks, trx);

    await trx.commit();
  } catch (err) {
    logger.error(err);
    await trx.rollback();
  }
};

const getCandles = async (logger = console) => {
  const { instruments, symbolToInstrument } = await getInstruments();
  if (isEmpty(instruments)) return [];

  const {
    candles,
    instrumentIds,
  } = await getAndPrepareAggregates(instruments, symbolToInstrument, logger);

  await saveCandles(candles, instrumentIds, logger);

  return candles;
};

const getTicks = async (logger = console) => {
  const { instruments, symbolToInstrument } = await getInstruments();
  if (isEmpty(instruments)) return [];

  const {
    ticks,
    instrumentIds,
  } = await getAndPrepareTicks(instruments, symbolToInstrument, logger);

  await saveTicks(ticks, instrumentIds, logger);

  return ticks;
};

module.exports = {
  getCandles,
  getTicks,
};
