'use strict';

const Controller = require('egg').Controller;

function getData(log) {
  return async () => {
    log('get data from raw');
    return 'sample';
  };
}

class HomeController extends Controller {
  async index() {
    const { app, ctx } = this;
    const log = t => { app.logger.info(t); console.log(t); };
    let data = await app.cache9.get('test', getData(log));
    log('get data:' + data);
    data = await app.cache9.get('test', getData(log));
    log('get data:' + data);
    ctx.body = 'test complete';
  }
}

module.exports = HomeController;
