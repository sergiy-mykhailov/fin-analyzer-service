const { Model } = require('objection');

class Instrument extends Model {
  static get tableName() {
    return 'instrument';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['symbol'],
      properties: {
        id: { type: 'integer', minimum: 1 },
        symbol: { type: 'string', minLength: 1, maxLength: 255 },
        name: { type: ['string', 'null'], minLength: 1, maxLength: 255 },
      },
    };
  }

  static insert(instruments) {
    return this.query().insert(instruments);
  }

  static deleteAll() {
    return this.query().delete();
  }
}

module.exports = Instrument;
