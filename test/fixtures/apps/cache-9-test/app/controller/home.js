'use strict';

const test = require('../../lib/test');
const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { app, ctx } = this;

    const log = t => { app.logger.info(t); console.log(t); };
    await test.runSingleTest(app, 'memory', log);
    await test.runSingleTest(app, 'redis', log);
    await test.runMultiplyTest(app, 'memory', log);
    await test.runMultiplyTest(app, 'redis', log);
    ctx.body = 'test complete';
  }
}

module.exports = HomeController;
