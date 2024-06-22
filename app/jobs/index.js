const fs = require('fs');
const path = require('path');
const { CronJob } = require('cron');

const validateFilenames = (fileName) =>
  fileName.indexOf('.') !== 0 && fileName !== 'index.js' && fileName.slice(-3) === '.js';

const register = async (server) => {
  fs.readdirSync(__dirname)
    .filter(validateFilenames)
    .forEach((fileName) => {
      require(path.join(__dirname, fileName)).forEach((config) => {
        const cron = CronJob.from({
          ...config,
          onTick: config.getHandler(server),
          start: false,
        });

        server.events.on('start', () => cron.start());
        server.events.on('stop', () => cron.stop());
      });
    });
};

module.exports = {
  name: 'cron-jobs',
  version: '0.0.1',
  register,
};