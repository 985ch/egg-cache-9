'use strict';

exports.keys = '123456';

exports.cache9 = {
  memory: {
    driver: 'memory',
    channel: 'cache9',
    ttl: 1,
    rds: {
      host: '127.0.0.1',
      db: 1,
    },
  },
  redis: {
    driver: 'redis',
    ttl: 1,
    rds: {
      host: '127.0.0.1',
      db: 0,
    },
  },
};
