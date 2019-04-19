import { assert } from 'chai'
import { gates, inits, operations, Program, QVM } from '../index.js'

let p;
let q = new QVM();

describe('initial tests', () => {
  before(() => {
    p = new Program();
    p.inst(gates.X(0));
    p.measure(0, 0);
  });

  it('creates Quil program code', () => {
    assert.equal(p.code(), 'DECLARE ro BIT[1]\nX 0\nMEASURE 0 ro[0]\n');
  });

  it('tells the QVM to run a program with one return value', function(done) {
    // return the classical registers
    q.run(p, 1, (err, returns) => {
      assert.equal(err, null);
      assert.equal(returns.length, 1);
      assert.equal(returns[0].length, 1);
      //assert.equal(returns[0][0], 1);
      done();
    });
  });
});

describe('series of gates', () => {
  before(() => {
    p = new Program();
    p.inst(gates.X(0), gates.Y(1), gates.Z(0));
    p.measure(0, 1);
  });

  it('remembers all instructions', (done) => {
    assert.equal(p.code(), 'DECLARE ro BIT[2]\nX 0\nY 1\nZ 0\nMEASURE 0 ro[1]\n');
    q.run(p, 1, (err, returns) => {
      assert.equal(err, null);
      done();
    });
  });
});

describe('H gate', () => {
  before(() => {
    p = new Program();
    p.inst(gates.H(0));
    p.measure(0, 0);
  });

  it('tells the QVM to run a program ten times', (done) => {
    q.run(p, 10, (err, returns) => {
      assert.equal(err, null);
      assert.equal(returns.length, 10);
      returns = returns.map((response) => {
        assert.equal(response.length, 1);
        return response[0];
      });
      //assert.isAtLeast(returns.indexOf(0), 0);
      //assert.isAtLeast(returns.indexOf(1), 0);
      done();
    });
  });
});


// defining new gates?  not supported

// wavefunction() ?  not supported

describe('phase gates', () => {
  it('writes a good CPHASE instruction', () => {
    let c = gates.CPHASE(Math.PI / 2, 1, 2);
    assert.equal(c.code, 'CPHASE(1.5707963267948966) 1 2');
  });
});

describe('QVM noise', () => {
  it('adds gate noise', () => {
    let q = new QVM(null, [1, 1, 1]);
    assert.equal(q.gate_noise.join(','), '1,1,1');
  });

  it('adds measurement noise', () => {
    let q = new QVM(null, null, [1, 1, 1]);
    assert.equal(q.measure_noise.join(','), '1,1,1');
  });

  it('validates noise', () => {
    let fn = () => {
      new QVM(null, [1, 1]);
    };
    let fn2 = () => {
      new QVM(null, [1, 1, 'a']);
    };
    let fn3 = () => {
      new QVM(null, [1, 1, 1], 'alphabet');
    };
    assert.throws(fn, Error, 'Gate noise was not specified correctly [Px, Py, Pz]');
    assert.throws(fn2, Error, 'Qubit / classical register index was not an integer');
    assert.throws(fn3, Error, 'Measure noise was not specified correctly [Px, Py, Pz]');
  });
});

describe('control flow', () => {
  it('embeds a program in a do-while loop', () => {
    p = new Program();
    p.inst(inits.TRUE(2));
    let loop = new Program();
    loop.inst(gates.X(0));
    p.while_do(2, loop);
    p.inst(inits.FALSE([0]));
    assert.equal(p.code(), 'DECLARE ro BIT[3]\nTRUE ro[2]\nLABEL @START1\nJUMP-UNLESS @END2 ro[2]\nX 0\nJUMP @START1\nLABEL @END2\nFALSE ro[0]\n');
  });

  it('embeds two programs in an if-then loop', () => {
    p = new Program();
    p.inst(inits.TRUE(2));
    let thener = new Program();
    thener.inst(gates.X(0));
    let elser = new Program();
    elser.inst(gates.H(0));
    p.if_then(1, thener, elser);
    p.inst(inits.FALSE([0]));
    assert.equal(p.code(), 'DECLARE ro BIT[3]\nTRUE ro[2]\nJUMP-WHEN @THEN3 ro[1]\nH 0\nJUMP @END4\nLABEL @THEN3\nX 0\nLABEL @END4\nFALSE ro[0]\n');
  });
});
