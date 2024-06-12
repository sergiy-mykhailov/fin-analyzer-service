const fs = require('fs');
const path = require('path');

const validateRoutesFilenames = (fileName) =>
  fileName.indexOf('.') !== 0 && fileName !== 'index.js' && fileName.slice(-3) === '.js';

const register = async (server) => {
  fs.readdirSync(__dirname)
    .filter(validateRoutesFilenames)
    .forEach((fileName) => {
      require(path.join(__dirname, fileName)).forEach((route) => {
        server.route(route);
      });
    });
};

module.exports = {
  name: 'routes',
  version: '0.0.1',
  register,
};