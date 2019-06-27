'use strict';

const cache9 = require('node-cache-9');

function createCache(config, app) {
  const { redis, pubRedis, subRedis, getRedis, rds } = config;
  if (config.class === 'memory' && pubRedis && subRedis) {
    config.getRedis = () => {
      return {
        sub: app.redis.get(subRedis),
        pub: app.redis.get(pubRedis),
      };
    };
  } else if (redis) {
    config.getRedis = () => app.redis.get(redis);
  } else if (!getRedis && !rds && app.redis) {
    config.getRedis = () => app.redis;
  }

  return cache9.create(config, err => app.coreLogger.error(err));
}

module.exports = app => {
  if (app.config.cache9)app.addSingleton('cache9', createCache);
};
