# egg-cache-9

![node version][node-image]
[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

[node-image]: https://img.shields.io/badge/node-%3E%3D8-blue.svg
[npm-image]: https://img.shields.io/npm/v/egg-cache-9.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-cache-9
[download-image]: https://img.shields.io/npm/dm/egg-cache-9.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-cache-9

该插件基于[node-cache-9](https://github.com/985ch/node-cache-9)缓存包实现了一个简单易用的缓存功能，同时支持将数据缓存到内存和将数据缓存到redis两种方式，也支持批量存取

## 安装

```sh
npm i egg-cache-9
```

## 使用方式

```js
// config/plugin.js
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

// 从缓存或者数据源获取数据
let data = await cache.get('key', async ()=>{ /* 在这里从数据源获取你的数据并返回 */ });
cache.renew('key'); // 更新缓存到期时间
await cache.clear('key'); //清除缓存数据

// 从缓存或者数据源获取一组数据
let {list, json} = await cache.getM('key', ids, obj=>obj.id, async ()=>{ /* 在这里从数据源获取你的数据并返回 */ });
cache.renewM('key', ids); // 更新缓存到期时间
await cache.clearM('key', ids); //清除缓存数据
await cache.clearM('key'); //清除缓存数据
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

// 从缓存或者数据源获取数据
let data = await cacheA.get('key', async ()=>{ /* 在这里从数据源获取你的数据并返回 */ });
cacheA.renew('key'); // 更新缓存到期时间
await cacheA.clear('key'); //清除缓存数据

// 从缓存或者数据源获取一组数据
let {list, json} = await cacheB.getM('key', ids, obj=>obj.id, async ()=>{ /* 在这里从数据源获取你的数据并返回 */ });
cacheB.renewM('key', ids); // 更新缓存到期时间
await cacheB.clearM('key', ids); //清除缓存数据
await cacheB.clearM('key'); //清除缓存数据
```
更多用法参见[node-cache-9](https://github.com/985ch/node-cache-9#cache-driver-class)


## 与egg-redis同时使用
在同时使用[egg-redis](https://github.com/eggjs/egg-redis)插件时，可以在配置中直接指定对应的redis客户端
```js
exports.cache9 = {
  default: {
    ttl: 300,
  },
  clients: {
    cacheA: { // 内存缓存需要同时指定pubRedis和subRedis
      class: 'memory',
      pubRedis: 'cachePub', // app.redis.get('cachePub')
      subRedis: 'cacheSub', // app.redis.get('cacheSub')
    },
    cacheB: { // redis缓存可以设置redis或什么都不设置
      class: 'redis',
      redis: 'cache', // app.redis.get('cache')
    },
    cacheC: { // 在没有getRedis，redis和rds的情况下，使用app.redis
      class: 'redis',
    }
  }
};
```

## 详细配置

请到 [config/config.default.js](config/config.default.js) 查看详细配置项说明。

## 单元测试

请先在本地启动一个redis服务器
```sh
npm run test
```

## License

[MIT](LICENSE)
