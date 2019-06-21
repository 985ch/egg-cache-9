/**
* 内存缓存，可以使用redis来实现多端同步刷新
*/
'use strict';
const _ = require('lodash');
const redis = require('redis');
const BaseCache = require('./base');

// 缓存基类
class MemoryCache extends BaseCache {
  constructor(config, app) {
    super(config, app);
    this.cache = {};

    const { channel, rds, getRedis, clearTime } = config;
    if (channel) {
      if (getRedis) {
        const { sub, pub } = getRedis();
        this.rdsSub = sub;
        this.rdsPub = pub;
      } else {
        this.rdsSub = redis.createClient(rds || {});
        this.rdsPub = redis.createClient(rds || {});
      }

      this.rdsSub.on('message', (chan, msg) => {
        if (channel !== chan) return;
        if (this.cache[msg]) delete this.cache[msg];
      });
      this.rdsSub.subscribe(channel);
    }
    if (clearTime && clearTime >= 1800) {
      setInterval(() => { this._clearTimeout(); }, clearTime * 1000);
    }
  }
  // 检查是否需要更新
  _checkUpdate(key, options = {}) {
    let ttl = options.ttl;
    if (_.isUndefined(ttl)) ttl = this.config.ttl || 0;
    if (ttl <= 0) return false;

    const now = Date.now();
    const last = _.get(this.cache, [ key, 't' ], 0);

    return (now - last) > ttl * 1000;
  }
  // 获取缓存内容
  async _getCache(key) {
    const obj = this.cache[key];
    if (!obj) return { success: false };
    return {
      success: true,
      data: obj.data,
    };
  }
  // 更新时间戳
  refresh(key) {
    const obj = this.cache[key];
    if (!obj) return;
    obj.t = Date.now();
  }
  // 保存数据
  _save(key, data) {
    this.cache[key] = {
      data,
      t: Date.now(),
    };
  }
  // 清除缓存
  clear(key) {
    if (this.rdsPub) {
      this.rdsPub.publish(this.config.channel, key);
    }
    if (this.cache[key]) {
      delete this.cache[key];
    }
  }
  // 清除超时数据
  _clearTimeout() {
    const now = Date.now();
    const clearTime = this.config.clearTime * 1000;
    for (const key in this.cache) {
      const cur = this.cache[key];
      if (now - cur.t > clearTime) {
        delete this.cache[key];
      }
    }
  }
}

module.exports = MemoryCache;
