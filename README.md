# jsquil

[![Greenkeeper badge](https://badges.greenkeeper.io/mapmeld/jsquil.svg)](https://greenkeeper.io/)

JavaScript interface for writing Quil programs, based on Rigetti Computing's 
<a href='https://github.com/rigetticomputing/pyquil'>pyQuil package</a>.

Make a list of instructions to run on a hybrid computer with both qubits and classical registers, and then use the
measure instruction to store a qubit value onto a classical register.

You can then return the value of these classical registers on each run of your program.

## Sample code

Tests based on the example code in pyQuil

```javascript
import { gates, inits, operations, Program, QVM, Connection } from 'jsquil'

// get an API key from http://forest.rigetti.com/
let c = new Connection('API_KEY');
let q = new QVM(c);

let p = new Program();
// put an X gate on the zeroth qubit
p.inst(gates.X(0));

// store the zeroth qubit's value in the first classical register
p.measure(0, 1);

// p now contains Quil instructions, which look like this:
// p.code()
// >  X 0
// >  MEASURE 0 [1]

// run the program twice, and return the first classical register on each iteration
q.run(p, [1], 2, (err, returns) => {
  // err = null
  // returns = [[1], [1]]
});
```

Changing the run command to return three classical registers' values:

```javascript
q.run(p, [0, 1, 2], 1, (err, returns) => { });
```

Changing the run command to execute a program ten times:

```javascript
q.run(p, [0], 10, (err, returns) => { });
```

Two ways to write a series of gate commands:

```javascript
p.inst(gates.X(0), gates.Y(1), gates.Z(0));
// same as
p.inst(gates.X(0));
p.inst(gates.Y(1));
p.inst(gates.Z(0));

p.code();
> "X 0\nY 1\nZ 0\n"
```

<a href='https://en.wikipedia.org/wiki/Quantum_Fourier_transform'>Quantum Fourier Transform</a>:

```javascript
p.inst(
  gates.H(2),
  gates.CPHASE(Math.PI / 2, 1, 2),
  gates.H(1),
  gates.CPHASE(Math.PI / 4, 0, 2),
  gates.CPHASE(Math.PI / 2, 0, 1),
  gates.H(0),
  gates.SWAP(0, 2)
);
```

Initializing a classical register value

```javascript
p.inst( inits.TRUE(0) );
```

Operations on classical registers

```javascript
p.inst(operations.EXCHANGE(0, 1));
// others: NOT, AND, OR, MOVE
```

Reset, wait, and halt commands:

```javascript
p.reset();
p.wait();
p.halt();
```

Looping some instructions while a classical register value is TRUE

```javascript
let classical_register = 2;
let loop_program = new Program();
loop_program.inst(gates.X(0), gates.H(0));
loop_program.measure(0, classical_register);
p.while_do(classical_register, loop_program);
```

An if-then-else statement combines multiple program objects and chooses one based on a classical register bit value

```javascript
let then_branch = new Program();
...
let else_branch = new Program();
...
p.if_then(test_register, then_branch, else_branch);
```

Adding gate and measurement noise to the QVM, to simulate a quantum computer

```javascript
let gate_noise = [x, y, z];
let measure_noise = [0.2, 0, 0];
let q = new QVM(connection, gate_noise, measure_noise);
```

## Tests

```bash
npm install mocha -g
npm test
```

## License

Apache license (same as pyQuil)
