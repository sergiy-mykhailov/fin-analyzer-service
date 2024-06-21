const { Model } = require('objection');

class Tick extends Model {
  static get tableName() {
    return 'tick';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['instrumentId', 'date', 'timestamp', 'price'],
      properties: {
        id: { type: 'integer', minimum: 1 },
        instrumentId: { type: 'integer', minimum: 1 },
        date: { format: 'date' },
        timestamp: { format: 'date-time' },
        price: { type: 'number' },
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

module.exports = Tick;
