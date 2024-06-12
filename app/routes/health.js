const Joi = require('joi');

module.exports = [
  {
    method: 'GET',
    path: '/ping',
    options: {
      handler: () => 'pong',
      description: 'Health check ping',
      response: {
        failAction: 'log',
        status: {
          200: Joi.string(),
        },
      },
    },
  },
];
