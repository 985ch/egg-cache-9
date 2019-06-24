'use strict';
const { promisify } = require('util');

const data = [
  { id: 1, name: 'sachiko' },
  { id: 2, name: 'momoka' },
  { id: 3, name: 'alice' },
  { id: 4, name: 'chie' },
  { id: 5, name: 'miria' },
];

const wait = promisify((n, callback) => {
  setTimeout(() => {
    callback(null, 0);
  }, n);
});

function getData(idx, info) {
  return async function() {
    info(`get data from raw [${idx}]`);
    idx -= 1;
    await wait(20);
    return data[idx];
  };
}

function getDatas(info) {
  return async function(list) {
    info(`get datas from raw [${list.join(',')}]`);
    await wait(10 + list.length * 3);
    const result = [];
    for (const idx of list) {
      result.push(data[idx - 1]);
    }
    return result;
  };
}

async function _singleTest(i, n, cache, info, options) {
  const s = Date.now();
  info(`${i}.get data ${n}`);
  const data = await cache.get('test' + n, getData(n, info), options);
  info(`result:${JSON.stringify(data)}(${Date.now() - s}ms)`);
}

async function runSingleTest(app, name, info) {
  info(`>>>>>> start a single test [${name}] <<<<<<`);
  const cache = app.cache9.get(name);
  await _singleTest(1, 1, cache, info);
  await _singleTest(2, 1, cache, info);
  await _singleTest(3, 2, cache, info);
  await _singleTest(4, 2, cache, info);
  info('5.clear data 1');
  await cache.clear('test1');
  await _singleTest(6, 1, cache, info);
  info('7.wait 3 seconds');
  await wait(3000);
  await _singleTest(8, 2, cache, info);
  info('>>>>>> complete a single Test <<<<<<\n');
}

async function _multiplyTest(i, list, cache, info) {
  const s = Date.now();
  info(`${i}.get data ${list.join(',')}`);
  const data = await cache.getM('test', list, obj => obj.id, getDatas(info), { getKey: obj => obj });
  info(`result:${JSON.stringify(data.list)}(${Date.now() - s}ms)`);
}

async function runMultiplyTest(app, name, info) {
  info(`>>>>>> start a multiply test [${name}] <<<<<<`);
  const cache = app.cache9.get(name);
  await _multiplyTest(1, [ 1, 2 ], cache, info);
  await _multiplyTest(2, [ 3, 4, 5 ], cache, info);
  await _multiplyTest(3, [ 5 ], cache, info);
  info('4.clear data [3,4]');
  await cache.clearM('test', [ 3, 4 ]);
  await _multiplyTest(5, [ 1, 2, 3, 4, 5 ], cache, info);
  info('6.clear all data');
  await cache.clearM('test');
  await _multiplyTest(7, [ 1, 2, 5 ], cache, info);
  info('8.wait 3 seconds');
  await wait(3000);
  await _multiplyTest(9, [ 1 ], cache, info);
  info('>>>>>> complete a multiply Test <<<<<<\n');
}

module.exports = {
  runSingleTest,
  runMultiplyTest,
};
