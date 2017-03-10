# jsquil

JavaScript interface for writing Quil programs, based on Rigetti Computing's 
<a href='https://github.com/rigetticomputing/pyquil'>pyQuil package</a>.

Make a list of instructions to run on qubits and classical registers, and then use the
measure instruction to store a qubit value onto a classical register.

You can then return the value of these classical registers on each run of your program.

## Sample code

I am going through the example code in pyQuil and trying to make equivalent tests and sample programs
in JavaScript.

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

Changing the run command to return three classical register values:

```javascript
q.run(p, [0, 1, 2], 1, (err, returns) => { });
```

Running a program ten times:

```javascript
q.run(p, [0], 10, (err, returns) => { });
```

Two ways to write multiple gate commands:

```javascript
p.inst(gates.X(0), gates.Y(1), gates.Z(0));
// same as
p.inst(gates.X(0));
p.inst(gates.Y(1));
p.inst(gates.Z(0));

p.code();
> "X 0\nY 1\nZ 0\n"
```

Quantum Fourier Transform:

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
p.inst( inits.TRUE([0, 1, 2]) );
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

An if-then statement based on a classical register bit value

```javascript
let then_branch = new Program();
...
let else_branch = new Program();
...
p.if_then(test_register, then_branch, else_branch);
```

## Tests

```bash
npm install mocha -g
npm test
```

## License

Apache license (same as pyQuil)
