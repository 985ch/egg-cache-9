# egg-cache-9

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-cache-9.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-cache-9
[download-image]: https://img.shields.io/npm/dm/egg-cache-9.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-cache-9

The plugin implements an easy-to-use caching function based on [node-cache-9](https://github.com/985ch/node-cache-9), which supports caching data into memory and caching data to redis.

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
  }
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

## Configuration

see [config/config.default.js](config/config.default.js) for more detail.

## Unit tests

Run redis-server in localhost first
```sh
npm run test
```

## License

[MIT](LICENSE)
