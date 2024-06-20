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
        price: { type: 'number', minimum: 1 },
      },
    };
  }

  static insert(items) {
    return this.query().insert(items);
  }

  static deleteByInstrumentIdsAndDate(instrumentIds, date) {
    return this.query()
      .whereIn('instrumentId', instrumentIds)
      .where('date', date)
      .delete();
  }
}

module.exports = Tick;
