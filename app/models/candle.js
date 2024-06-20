const { Model } = require('objection');
const Instrument = require('./instrument');

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
        open: { type: 'number', minimum: 1 },
        close: { type: 'number', minimum: 1 },
        high: { type: 'number', minimum: 1 },
        low: { type: 'number', minimum: 1 },
        volume: { type: 'number', minimum: 1 },
      },
    };
  }

  static get relationMappings() {
    return {
      instrument: {
        relation: Model.HasOneRelation,
        modelClass: Instrument,
        join: {
          from: `${this.tableName}.instrumentId`,
          to: `${Instrument.tableName}.id`,
        },
      },
    };
  }

  static insert(items) {
    return this.query().insert(items);
  }

  static deleteByInstrumentIdsInDateRange(instrumentIds, from, to) {
    const range = from < to ? [from, to] : [to, from];

    return this.query()
      .whereIn('instrumentId', instrumentIds)
      .whereBetween('timestamp', range)
      .delete();
  }
}

module.exports = Candle;
