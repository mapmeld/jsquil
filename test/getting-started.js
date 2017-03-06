import { assert } from 'chai'
import { gates, Program, QVM } from '../index.js'

let p;
let q = new QVM();

describe('initial tests', function() {
  before(function() {
    p = new Program();
    p.inst(new gates.X(0));
    p.measure(0, 0);
  });

  it('creates Quil program code', function(done) {
    assert.equal(p.code(), 'X 0\nMEASURE 0 [0]\n');
    done();
  });
  
  it('tells the QVM to run a program with one return value', function(done) {
    // return the zeroth classical register
    q.run(p, [0], function(err, returns) {
      assert.equal(err, null);
      assert.equal(returns.length, 1);
      assert.equal(returns[0], 1);
      done();
    });
  });
  
  it('tells the QVM to run a program with three return values', function(done) {
    q.run(p, [0, 1, 2], function(err, returns) {
      assert.equal(err, null);
      assert.equal(returns.length, 3);
      assert.equal(returns[0], 1);
      assert.equal(returns[1], 0);
      assert.equal(returns[2], 0);
      done();
    });
  });
});