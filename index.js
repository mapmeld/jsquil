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
        qubits[instruction.qubit] = 1;
      } else {
        classical_bits[0] = qubits[0];
      }
    }
    callback(null);
  }
};

var QVM = function() { };
QVM.prototype = {
  run: function(program, classical_indexes, callback) {
    program.run(function(err) {
      if (err) {
        return callback(err);
      }
      
      var returns = [];
      function readIndex(i) {
        if (i >= classical_indexes.length) {
          return callback(null, returns);
        }
        returns.push(valueOfClassical(classical_indexes[i]));
        readIndex(i + 1);
      }
      readIndex(0);
    });
  }
};

export { gates, Program, QVM };