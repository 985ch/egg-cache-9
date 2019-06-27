# egg-cache-9

![node version][node-image]
[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

[node-image]: https://img.shields.io/badge/node-%3E%3D8-blue.svg
[npm-image]: https://img.shields.io/npm/v/egg-cache-9.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-cache-9
[download-image]: https://img.shields.io/npm/dm/egg-cache-9.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-cache-9

The plugin implements an easy-to-use caching function based on [node-cache-9](https://github.com/985ch/node-cache-9), which supports caching data into memory and caching data to redis.

### [中文说明](./README.zh_CN.md)
## Install

```bash
$ npm i egg-cache-9 --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.cache9 = {
  enable: true,
  package: 'egg-cache-9',
};
```
```js
// {app_root}/config/config.default.js
exports.cache9 = {
  client: {
    class: 'memory',
    ttl: 300,
  }
};


// {app_root}/app/****.js
const cache = app.cache9;

//  get data from a data source or cache
let data = await cache.get('key', async ()=>{ /* get data from data source and return it */ });
cache.renew('key'); // update expiration time
await cache.clear('key'); // clear cache

// get a lot of datas from a data source or cache
let {list, json} = await cache.getM('key', ids, obj=>obj.id, async (lst)=>{ /* get data from data source and return it */ });
cache.renewM('key', ids); // update expiration time
await cache.clearM('key', ids); //clear cache
await cache.clearM('key'); //clear cache
```
```js
// {app_root}/config/config.default.js
exports.cache9 = {
  default: {
    ttl: 300,
  },
  clients: {
    cacheA: {
      class: 'memory',
    },
    cacheB: {
      class: 'redis',
      rds: { host: '127.0.0.1' }
    }
  }
};


// {app_root}/app/****.js
const cacheA = app.cache9.get('cacheA');
const cacheB = app.cache9.get('cacheB');

// get data from a data source or cache
let data = await cacheA.get('key', async ()=>{ /* get data from data source and return it */ });
cacheA.renew('key'); // update expiration time
await cacheA.clear('key'); //clear cache

// get a lot of datas from a data source or cache
let {list, json} = await cacheB.getM('key', ids, obj=>obj.id, async (lst)=>{ /* get data from data source and return it */ });
cacheB.renewM('key', ids); // update expiration time
await cacheB.clearM('key', ids); //clear cache
await cacheB.clearM('key'); //clear cache
```
see [node-cache-9](https://github.com/985ch/node-cache-9#cache-driver-class) for more detail.


## Use with egg-redis
When using the [egg-redis](https://github.com/eggjs/egg-redis) plugin, you can specify the redis client directly in the configuration.
```js
exports.cache9 = {
  default: {
    ttl: 300,
  },
  clients: {
    cacheA: { // The memory cache needs to set both pubRedis and subRedis as string
      class: 'memory',
      pubRedis: 'cachePub', // app.redis.get('cachePub')
      subRedis: 'cacheSub', // app.redis.get('cacheSub')
    },
    cacheB: { // redis cache can set redis as string
      class: 'redis',
      redis: 'cache', // app.redis.get('cache')
    },
    cacheC: { // If you have not configured getRedis, redis and rds, use app.redis
      class: 'redis',
    }
  }
};
```

## Configuration

see [config/config.default.js](config/config.default.js) for more detail.

## Unit tests

Run redis-server in localhost first
```sh
npm run test
```

## License

[MIT](LICENSE)<br />
This README was translate by [google](https://translate.google.cn)
