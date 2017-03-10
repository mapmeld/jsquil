# jsquil

JavaScript interface for writing Quil programs, from Rigetti Computing's 
<a href='https://github.com/rigetticomputing/pyquil'>pyQuil package</a>.

## Sample code

I am going through the example code in pyQuil and trying to make equivalent tests and sample programs
in JavaScript.

Here's how you would run an X-gate on a qubit, and store it in a classical register.

```javascript
import { gates, inits, Program, QVM, Connection } from 'jsquil'

// get an API key from http://forest.rigetti.com/
// if c=null you will get the internal test returns
let c = new Connection('API_KEY');
let q = new QVM(c);

let p = new Program();
// put an X gate on the zeroth qubit
p.inst(gates.X(0));
// store the zeroth qubit's value in the zeroth classical bit
p.measure(0, 0);
// p.code() =
//   X 0
//   MEASURE 0 [0]

// run the program once, and return the zeroth classical bit on each iteration
q.run(p, [0], 1, (err, returns) => {
  // err = null
  // returns = [[1]]
});
```

Changing the last command to return three classical registers:

```javascript
q.run(p, [0, 1, 2], 1, (err, returns) => { });
```

Running a program ten times:

```javascript
q.run(p, [0], 10, (err, returns) => { });
```

Writing a chain of gate commands:

```javascript
p.inst(gates.X(0), gates.Y(1), gates.Z(0));
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

Looping some instructions while a classical register value is TRUE

```javascript
let classical_register = 2;
let loop_program = new Program();
loop_program.inst(gates.X(0), gates.H(0));
loop_program.measure(0, classical_register);
p.while_do(classical_register, loop_program);
```

An if-then statement

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
