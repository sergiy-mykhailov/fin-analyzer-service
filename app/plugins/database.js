const Knex = require('knex');
const knexConfig = require('../../knexfile');
const { Model } = require('objection');

const register = async () => {
  const knex = Knex(knexConfig.development); // TODO: development -> get env type from env variables

  Model.knex(knex);
};

module.exports = {
  name: 'database',
  version: '0.0.1',
  register,
};
