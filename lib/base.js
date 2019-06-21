/**
* 缓存基类，options包含以下属性
* keep:false,    //无法获取源数据但缓存中仍有数据时是否使用缓存中的数据
* disable:false, //是否禁用缓存并且直接从数据源获取数据
* update:false,  //是否强制更新缓存数据
* ttl:0,         //缓存时间，单位秒，0即为无限
* refresh:false, //是否自动更新到期时间
*/
'use strict';
const _ = require('lodash');

// 缓存基类
class BaseCache {
  constructor(config, app) {
    this.config = config;
    this.app = app;
  }
  // 更新或者获取缓存
  async get(key, func, options) {
    let { update, disable, keep, refresh } = options || {};
    if (_.isUndefined(keep)) keep = this.config.keep;
    if (_.isUndefined(refresh)) refresh = this.config.refresh;

    if (disable) return await this._getRaw(func, options);

    const needUpdate = (update || this._checkUpdate(key, options));
    const { success, data } = needUpdate ? { success: false } : await this._getCache(key, options);
    if (success) {
      if (refresh) this.refresh(key, options);
      return data;
    }

    try {
      const result = await this._getRaw(func, options);
      this._save(key, result, options);

      return result;
    } catch (e) {
      if (!keep) throw e;
      if (success) {
        this.app.logger.error(e);
        return data;
      }
      if (needUpdate) {
        const old = await this._getCache(key, options);
        if (old.success) {
          this.app.logger.error(e);
          return data;
        }
      }
      throw e;
    }
  }
  // 更新时间戳
  refresh(/* key, options*/) {
    // reset TTL
  }
  // 清除缓存
  clear(/* key*/) {
    // clear the cache data
  }
  // 检查是否需要更新
  _checkUpdate(/* key, options */) {
    return true;
  }
  // 获取缓存内容
  async _getCache(/* key, options*/) {
    throw new Error('invaild function:[_getCache]');
    // return { success, data }
  }
  // 获取源数据
  async _getRaw(func /* , options */) {
    return await func();
  }
  // 保存数据
  _save(/* key, data, options*/) {
    // save data to cache
  }
}

module.exports = BaseCache;
