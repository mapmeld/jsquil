import { assert } from 'chai'
import { QVM, Connection } from '../index.js'

describe('validate connections', () => {
  it('rejects a connection without an API key', () => {
    let fn = () => {
      new Connection();
    };
    assert.throws(fn, Error, 'The API now requires both a User ID and an API Key');
  });

  it('has a default endpoint', () => {
    let c = new Connection({ api_key: 'API KEY', user_id: 'USER ID' });
    assert.equal(c.API_KEY, 'API KEY');
    assert.equal(c.ENDPOINT, 'https://forest-server.qcs.rigetti.com');
  });

  it('adds a new endpoint', () => {
    let c = new Connection({ api_key: 'API KEY', user_id: 'USER ID' }, 'example.com');
    assert.equal(c.API_KEY, 'API KEY');
    assert.equal(c.ENDPOINT, 'example.com');
  });

  it('adds a connection to a QVM', () => {
    let c = new Connection({ api_key: 'API KEY', user_id: 'USER ID' });
    let q = new QVM(c);
    assert.equal(q.connection.API_KEY, 'API KEY');
  });
});
