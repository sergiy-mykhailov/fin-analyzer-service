const Hapi = require('@hapi/hapi');
const config = require('./config/env');
const { preResponse } = require('./utils/errors');
const routes = require('./routes');
const logger = require('./plugins/logger');
const database = require('./plugins/database');

const options = {
  port: config.service.port,
  host: config.service.host,
};

const plugins = [routes, logger, database];
// TODO: add swagger

const start = async () => {
  const server = Hapi.server(options);

  await server.register(plugins);
  server.ext('onPreResponse', preResponse);
  await server.start();

  return server;
};

module.exports = {
  start,
};
