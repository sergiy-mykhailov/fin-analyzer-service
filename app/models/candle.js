const { Model } = require('objection');

class Candle extends Model {
  static get tableName() {
    return 'candle';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['instrumentId', 'timestamp', 'open', 'close', 'high', 'low', 'volume'],
      properties: {
        id: { type: 'integer', minimum: 1 },
        instrumentId: { type: 'integer', minimum: 1 },
        timestamp: { format: 'date-time' },
        open: { type: 'number' },
        close: { type: 'number' },
        high: { type: 'number' },
        low: { type: 'number' },
        volume: { type: 'number' },
      },
    };
  }

  static insert(items, trx) {
    return this.query(trx).insert(items);
  }

  static deleteByInstrumentIdsInDateRange(instrumentIds, { from, to }, trx) {
    const range = from < to ? [from, to] : [to, from];

    return this.query(trx)
      .whereIn('instrumentId', instrumentIds)
      .whereBetween('timestamp', range)
      .delete();
  }
}

module.exports = Candle;
