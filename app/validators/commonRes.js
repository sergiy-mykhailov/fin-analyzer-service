const Joi = require('joi');

const noContent = Joi.string().empty('');

module.exports = {
  noContent,
};
