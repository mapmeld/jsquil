import 'request'

var qubits = [];
var classical_bits = [];

var valueOfQubit = function(qubit_index) {
  return qubits[qubit_index] || 0;
};

var valueOfClassical = function(classical_index) {
  return classical_bits[classical_index] || 0;
};

var gates = {
  X: function(qubit_index) {
    // apply X-gate to qubit-index
    this.qubit = qubit_index;
    this.code = 'X ' + qubit_index;
  },
  
  H: function(qubit_index) {
    // apply H-gate to qubit-index
    this.qubit = qubit_index;
    this.code = 'H ' + qubit_index;
  }
};

var Program = function() { };
Program.prototype = {
  src: [],

  inst: function(formed_instruction) {
    this.src.push(formed_instruction);
  },
  
  measure: function(qubit_index, classical_index) {
    this.src.push('MEASURE ' + qubit_index + ' [' + classical_index + ']');
  },
  
  code: function() {
    var quil = '';
    for (var a = 0; a < this.src.length; a++) {
      if (typeof this.src[a] === 'object') {
        quil += this.src[a].code;
      } else {
        quil += this.src[a];
      }
      quil += '\n';
    }
    return quil;
  },
  
  run: function(callback) {
    for (var a = 0; a < this.src.length; a++) {
      var instruction = this.src[a];
      if (typeof instruction === 'object') {
        if (instruction.code[0] === 'X') {
          qubits[instruction.qubit] = 1;
        } else if (instruction.code[0] === 'H') {
          qubits[instruction.qubit] = ((Math.random() > 0.5) ? 1 : 0);
        }
      } else {
        classical_bits[0] = qubits[0];
      }
    }
    callback(null);
  }
};

var QVM = function() { };
QVM.prototype = {
  runOnce: function(callback) {
    let cix = this.classical_indexes;
    this.program.run(function(err) {
      if (err) {
        return callback(err);
      }
      
      var returns = [];
      function readIndex(i) {
        if (i >= cix.length) {
          return callback(null, returns);
        }
        returns.push(valueOfClassical(cix[i]));
        readIndex(i + 1);
      }
      readIndex(0);
    });
  },
  
  run: function(program, classical_indexes, iterations, callback) {
    this.program = program;
    this.classical_indexes = classical_indexes;

    let responses = [];
    if (!iterations || isNaN(iterations * 1)) {
      iterations = 1;
    }
    
    var runMe = (function(i) {
      if (i >= iterations) {
        console.log('too big');
        return callback(null, responses);
      }
      this.runOnce((function(err, response) {
        if (err) {
          return callback(err, []);
        }
        responses.push(response);
        runMe(i + 1);
      }).bind(this));
    }).bind(this);
    runMe(0);
  }
};

export { gates, Program, QVM };