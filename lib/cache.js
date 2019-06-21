'use strict';

const _ = require('lodash');
const BaseDriver = require('./base');
const memory = require('./memory');
const redis = require('./redis');

const drivers = { memory, redis };

module.exports = app => {
  const cfg = app.config.cache9;
  const cache = {};

  for (const key in cfg) {
    const cur = cfg[key];
    let driver = null;
    if (_.isFunction(cur.driver)) {
      driver = new cur.driver(cur, app);
    } else if (drivers[cur.driver]) {
      driver = new drivers[cur.driver](cur, app);
    } else {
      throw new Error(`invalid cache driver in config '${key}'`);
    }
    cache[key] = driver;
  }

  app.cache = cache;
  app.BaseCacheDriver = BaseDriver;
};
