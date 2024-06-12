const Hapi = require('@hapi/hapi');
const config = require('./config/env');
const routes = require('./routes');
const logger = require('./plugins/logger');

const options = {
  port: config.service.port,
  host: config.service.host,
};

const plugins = [routes, logger];

const start = async () => {
  const server = Hapi.server(options);

  await server.register(plugins);
  await server.start();

  return server;
};

module.exports = {
  start,
};
