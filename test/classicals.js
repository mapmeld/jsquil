import { assert } from 'chai'
import { inits, operations } from '../index.js'

describe('validate classical stuff', () => {
  it('sets a classical register to TRUE', () => {
    let ini = inits.TRUE(0);
    assert.equal(ini.code, 'TRUE [0]');
  });
  
  it('handles a classical register if it is a string', () => {
    let ini = inits.TRUE('0');
    assert.equal(ini.code, 'TRUE [0]');
  });
  
  it('throws an error if the classical register is not a number', () => {
    let fn = () => {
      inits.TRUE('fail');
    };
    assert.throws(fn, Error, 'Qubit / classical register index was not an integer');
  });
});