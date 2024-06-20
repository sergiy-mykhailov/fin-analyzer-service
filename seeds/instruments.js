/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  const symbols = [
    'EURUSD',
    'EURCAD',
    'EURJPY',
    'EURAUD',
    'EURGBP',
    'EURCHF',
    'USDCAD',
    'USDJPY',
    'USDCHF',
    'USDCNH',
    'GBPUSD',
    'GBPCAD',
    'GBPAUD',
    'GBPJPY',
    'GBPCHF',
    'AUDUSD',
    'AUDCHF',
    'AUDCAD',
    'AUDJPY',
    'CHFJPY',
    'CADJPY',
    'CADCHF',
  ];
  const instruments = symbols.map((symbol, index) => ({ id: index + 1, symbol }));

  // Deletes ALL existing entries
  await knex('instrument').del();

  await knex('instrument').insert(instruments);
};
