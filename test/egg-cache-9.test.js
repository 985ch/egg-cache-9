'use strict';

const mock = require('egg-mock');

describe('test/egg-cache-9.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/egg-cache-9-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, eggCache9')
      .expect(200);
  });
});
