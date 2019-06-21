/**
* redis缓存，最常用的缓存
*/
'use strict';
const _ = require('lodash');
const redis = require('redis');
const { promisify } = require('util');
const BaseCache = require('./base');

// 缓存基类
class RedisCache extends BaseCache {
  constructor(config, app) {
    super(config, app);
    const { rds, getRedis } = config;
    if (getRedis) {
      this.rds = getRedis();
    } else {
      const cli = redis.createClient(rds || {});
      this.rds = cli;
      this.getAsync = promisify(cli.get).bind(cli);
    }
    if (!this.rds) throw new Error('invaild redis client');
  }
  // 检查是否需要更新
  _checkUpdate() {
    return false;
  }
  // 获取缓存内容
  async _getCache(key, options = {}) {
    let { raw } = options;
    if (_.isUndefined(raw)) raw = this.config.raw || false;
    const realKey = this._getKey(key);
    const data = this.getAsync ? await this.getAsync(realKey) : await this.rds.get(realKey);
    if (!data) return { success: false };
    return {
      success: true,
      data: raw ? data : JSON.parse(data),
    };
  }
  // 更新时间戳
  refresh(key, options = {}) {
    let ttl = options.ttl;
    if (_.isUndefined(ttl)) ttl = this.config.ttl || 0;
    if (ttl > 0) this.rds.expire(this._getKey(key), ttl);
  }
  // 保存数据
  _save(key, data, options = {}) {
    let { ttl, raw } = options;
    if (_.isUndefined(ttl)) ttl = this.config.ttl || 0;
    if (_.isUndefined(raw)) raw = this.config.raw || false;
    this.rds.setex(this._getKey(key), ttl, JSON.stringify(data));
  }
  // 清除缓存
  clear(key) {
    this.rds.del(this._getKey(key));
  }
  // 获取redis键
  _getKey(key) {
    return `${this.config.channel}:${key}`;
  }
}

module.exports = RedisCache;
