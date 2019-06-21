'use strict';

const Controller = require('egg').Controller;

function test(x) {
  return async function() {
    console.log('raw!');
    return x;
  };
}

function sleep(milliSeconds) {
  const startTime = new Date().getTime();
  while (new Date().getTime() < startTime + milliSeconds);
}

async function runATest(store, ctx, finish) {
  finish.count++;
  console.log(`start ${store} test`);
  let data = await ctx.cache[store].get('test', test(store + ' 1st'));
  console.log('1:' + data);

  data = await ctx.cache[store].get('test', test(store + ' 2nd update'), { update: true });
  console.log('2:' + data);

  ctx.cache[store].refresh('test');
  console.log('refreshTime!');

  data = await ctx.cache[store].get('test', test(store + ' 3rd'));
  console.log('3:' + data);

  ctx.cache[store].clear('test');
  console.log('clear!');

  data = await ctx.cache[store].get('test', test(store + ' 4th'));
  console.log('4:' + data);

  sleep(1000);
  data = await ctx.cache[store].get('test', test(store + ' 5th'));
  console.log('5:' + data);
  finish.count--;

  console.log(`complete ${store} test`);
}

class HomeController extends Controller {
  async index() {
    const { ctx } = this;

    const finish = { count: 0 };
    // await runATest('memory', ctx, finish);
    console.log('');
    await runATest('redis', ctx, finish);
    this.ctx.body = 'hi, ' + this.app.plugins.eggCache9.name;
  }
}

module.exports = HomeController;
