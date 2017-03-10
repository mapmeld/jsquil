# jsquil

JavaScript interface for writing Quil programs, based on Rigetti Computing's 
<a href='https://github.com/rigetticomputing/pyquil'>pyQuil package</a>.

## Sample code

I am going through the example code in pyQuil and trying to make equivalent tests and sample programs
in JavaScript.

Here's how you would run an X-gate on a qubit, and store it in a classical register.

```javascript
import { gates, Program, QVM } from 'jsquil'

let q = new QVM();
let p = new Program();

p.inst(new gates.X(0));
p.measure(0, 0);
// p.code() =
//   X 0
//   MEASURE 0 [0]

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
p.inst(new gates.X(0), new gates.Y(1), new gates.Z(0));
p.code();
> "X 0\nY 1\nZ 0\n"
```

## License

Apache license (same as pyQuil)
