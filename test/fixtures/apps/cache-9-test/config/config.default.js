'use strict';

exports.keys = '123456';

exports.cache9 = {
  default: {
    channel: 'cache9',
    ttl: 2,
  },
  clients: {
    memory: {
      class: 'memory',
      rds: {
        host: '127.0.0.1',
        db: 1,
      },
    },
    redis: {
      class: 'redis',
      rds: {
        host: '127.0.0.1',
        db: 0,
      },
    },
  },
};
