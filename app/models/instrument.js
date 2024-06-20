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

  static findAll() {
    return this.query().select();
  }

  static insert(items) {
    return this.query().insert(items);
  }

  static deleteAll() {
    return this.query().delete();
  }
}

module.exports = Instrument;
