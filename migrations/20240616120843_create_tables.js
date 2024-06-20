/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.raw(`
    CREATE TABLE instrument (
      id SERIAL PRIMARY KEY,
      symbol VARCHAR(255) NOT NULL UNIQUE,
      name VARCHAR(255)
    );
  `);
  await knex.raw(`
    CREATE TABLE candle (
      id SERIAL PRIMARY KEY,
      instrument_id INTEGER NOT NULL REFERENCES instrument(id) ON DELETE CASCADE,
      timestamp TIMESTAMP,
      open NUMERIC,
      close NUMERIC,
      high NUMERIC,
      low NUMERIC,
      volume NUMERIC,
      UNIQUE (instrument_id, timestamp)
    );
  `);
  await knex.raw(`
    CREATE TABLE tick (
      id SERIAL PRIMARY KEY,
      instrument_id INTEGER NOT NULL REFERENCES instrument(id) ON DELETE CASCADE,
      date DATE,
      timestamp TIMESTAMP,
      price NUMERIC
    );
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.raw('DROP TABLE tick;');
  await knex.raw('DROP TABLE candle;');
  await knex.raw('DROP TABLE instrument;');
};
