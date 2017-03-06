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
    q.run(p, [0], 1, function(err, returns) {
      assert.equal(err, null);
      assert.equal(returns.length, 1);
      assert.equal(returns[0].length, 1);
      assert.equal(returns[0][0], 1);
      done();
    });
  });
  
  it('tells the QVM to run a program with three return values', function(done) {
    q.run(p, [0, 1, 2], 1, function(err, returns) {
      assert.equal(err, null);
      assert.equal(returns.length, 1);
      assert.equal(returns[0].length, 3);
      assert.equal(returns[0][0], 1);
      assert.equal(returns[0][1], 0);
      assert.equal(returns[0][2], 0);
      done();
    });
  });
});

describe('series of gates', function() {
  before(function() {
    p = new Program();
    p.inst(new gates.X(0), new gates.Y(1), new gates.Z(0));
    p.measure(0, 1);
  });
  
  it('remembers all instructions', function(done) {
    assert.equal(p.code(), 'X 0\nY 1\nZ 0\nMEASURE 0 [1]\n');
    q.run(p, [0], 1, function(err, returns) {
      assert.equal(err, null);
      done();
    });
  });
});

describe('H gate', function() {
  before(function() {
    p = new Program();
    p.inst(new gates.H(0));
    p.measure(0, 0);
  });

  it('tells the QVM to run a program ten times', function(done) {
    q.run(p, [0], 10, function(err, returns) {
      assert.equal(err, null);
      assert.equal(returns.length, 10);
      returns = returns.map(function(response) {
        assert.equal(response.length, 1);
        return response[0];
      });
      assert.isAtLeast(returns.indexOf(0), 0);
      assert.isAtLeast(returns.indexOf(1), 0);
      done();
    });
  });
});