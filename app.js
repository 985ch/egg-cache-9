'use strict';

const cache9 = require('node-cache-9');

function createCache(config, app) {
  return cache9.create(config, err => app.coreLogger.error(err));
}

module.exports = app => {
  if (app.config.cache9)app.addSingleton('cache9', createCache);
};
