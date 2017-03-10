import { assert } from 'chai'
import { QVM, Connection } from '../index.js'

describe('validate connections', () => {
  it('rejects a connection without an API key', () => {
    let fn = () => {
      new Connection();
    };
    assert.throws(fn, Error, 'No API Key was provided');
  });
  
  it('has a default endpoint', () => {
    let c = new Connection('API KEY');
    assert.equal(c.API_KEY, 'API KEY');
    assert.equal(c.ENDPOINT, 'https://api.rigetti.com/qvm');
  });
  
  it('adds a new endpoint', () => {
    let c = new Connection('API KEY', 'example.com');
    assert.equal(c.API_KEY, 'API KEY');
    assert.equal(c.ENDPOINT, 'example.com');
  });
  
  it('adds a connection to a QVM', () => {
    let c = new Connection('API KEY');
    let q = new QVM(c);
    assert.equal(q.connection.API_KEY, 'API KEY');
  });
});