const request = require('request');

var qubits = [];
var classical_bits = [];
var unique_labeler = 1;

var valueOfQubit = function(qubit_index) {
  return qubits[qubit_index] || 0;
};

var valueOfClassical = function(classical_index) {
  return classical_bits[classical_index] || 0;
};

var validInt = function(val) {
  if (Math.round(val) === val) {
    return val;
  } else if (Math.round(1 * val) === 1 * val) {
    return 1 * val;
  } else {
    throw Error('Qubit / classical register index was not an integer');
  }
};

var inits = {
  TRUE: (classical_indexes) => {
    classical_indexes = classical_indexes.map(validInt);
    return {
      classical_indexes: classical_indexes,
      code: 'TRUE [' + classical_indexes.join(',') + ']'
    }
  },
  FALSE: (classical_indexes) => {
    classical_indexes = classical_indexes.map(validInt);
    return {
      classical_indexes: classical_indexes,
      code: 'FALSE [' + classical_indexes.join(',') + ']'
    }
  }
};

var gates = {
  H: (qubit_index) => {
    // apply H-gate to qubit-index
    return {
      qubit: validInt(qubit_index),
      code: 'H ' + qubit_index
    };
  },
  
  I: (qubit_index) => {
    // apply I-gate to qubit-index
    return {
      qubit: validInt(qubit_index),
      code: 'I ' + qubit_index
    };
  },
  
  S: function(qubit_index) {
    // apply S-gate to qubit-index
    return {
      qubit: validInt(qubit_index),
      code: 'S ' + qubit_index
    };
  },
  
  T: function(qubit_index) {
    // apply T-gate to qubit-index
    return {
      qubit: validInt(qubit_index),
      code: 'T ' + qubit_index
    };
  },
  
  X: function(qubit_index) {
    // apply X-gate to qubit-index
    return {
      qubit: validInt(qubit_index),
      code: 'X ' + qubit_index
    };
  },
  
  Y: function(qubit_index) {
    // apply Y-gate to qubit-index
    return {
      qubit: validInt(qubit_index),
      code: 'Y ' + qubit_index
    };
  },
  
  Z: function(qubit_index) {
    // apply Z-gate to qubit-index
    return {
      qubit: validInt(qubit_index),
      code: 'Z ' + qubit_index
    };
  },
  
  PHASE: function(phase, qubit_index) {
    return {
      qubit: validInt(qubit_index),
      code: 'PHASE ' + qubit_index
    };
  },
  CPHASE00: function(alpha, qubit_index) {
    alpha *= 1;
    let gate = {
      phase: alpha.toFixed(16) * 1,
      qubits: [validInt(qubit_index_a), validInt(qubit_index_b)],
    };
    gate.code = 'CPHASE00(' + gate.phase + ') ' + gate.qubits.join(' ');
    return gate;
  },
  CPHASE01: function(alpha, qubit_index) {
    alpha *= 1;
    let gate = {
      phase: alpha.toFixed(16) * 1,
      qubits: [validInt(qubit_index_a), validInt(qubit_index_b)],
    };
    gate.code = 'CPHASE01(' + gate.phase + ') ' + gate.qubits.join(' ');
    return gate;
  },
  CPHASE10: function(alpha, qubit_index) {
    alpha *= 1;
    let gate = {
      phase: alpha.toFixed(16) * 1,
      qubits: [validInt(qubit_index_a), validInt(qubit_index_b)],
    };
    gate.code = 'CPHASE10(' + gate.phase + ') ' + gate.qubits.join(' ');
    return gate;
  },
  CPHASE: function(alpha, qubit_index_a, qubit_index_b) {
    alpha *= 1;
    let gate = {
      phase: alpha.toFixed(16) * 1,
      qubits: [validInt(qubit_index_a), validInt(qubit_index_b)],
    };
    gate.code = 'CPHASE(' + gate.phase + ') ' + gate.qubits.join(' ');
    return gate;
  },
  RX: function(phase, qubit_index) {
    phase *= 1;
    return {
      phase: phase.toFixed(16) * 1,
      code: 'RX ' + qubit_index
    };
  },
  RY: function(phase, qubit_index) {
    phase *= 1;
    return {
      phase: phase.toFixed(16) * 1,
      code: 'RY ' + qubit_index
    };
  },
  RZ: function(phase, qubit_index) {
    phase *= 1;
    return {
      phase: phase.toFixed(16) * 1,
      code: 'RZ ' + qubit_index
    };
  },
  CNOT: function(qubit_index) {
    return {
      qubit: validInt(qubit_index),
      code: 'CNOT ' + qubit_index
    };
  },
  CCNOT: function(qubit_index) {
    return {
      qubit: validInt(qubit_index),
      code: 'CCNOT ' + qubit_index
    };
  },
  SWAP: function(qubit_index_a, qubit_index_b) {
    return {
      qubits: [validInt(qubit_index_a), validInt(qubit_index_b)],
      code: 'SWAP ' + qubit_index_a + ' ' + qubit_index_b
    };
  },
  CSWAP: function(qubit_index) {
    return {
      qubits: [validInt(qubit_index_a), validInt(qubit_index_b)],
      code: 'CSWAP ' + qubit_index_a + ' ' + qubit_index_b
    };
  },
  ISWAP: function(qubit_index) {
    return {
      qubits: [validInt(qubit_index_a), validInt(qubit_index_b)],
      code: 'ISWAP ' + qubit_index_a + ' ' + qubit_index_b
    };
  },
  PSWAP: function(alpha, qubit_index) {
    return {
      qubits: [validInt(qubit_index_a), validInt(qubit_index_b)],
      code: 'PSWAP ' + qubit_index_a + ' ' + qubit_index_b
    };
  }
};

// not supporting: defgate

var Program = function() {
  this.src = [];
};
Program.prototype = {
  inst: function() {
    for (var i in arguments) {
      var formed_instruction = arguments[i];
      this.src.push(formed_instruction);
    }
  },
  
  measure: function(qubit_index, classical_index) {
    this.src.push('MEASURE ' + validInt(qubit_index) + ' [' + validInt(classical_index) + ']');
  },
  
  code: function() {
    var quil = '';
    for (var a = 0; a < this.src.length; a++) {
      if (typeof this.src[a] === 'object') {
        if (typeof this.src[a].code === 'function') {
          // embedded program
          quil += this.src[a].code();
        } else {
          quil += this.src[a].code + '\n';
        }
      } else {
        quil += this.src[a] + '\n';
      }
    }
    return quil;
  },
  
  concat: function(otherProgram) {
    this.src.concat(otherProgram.src);
  },
  
  pop: function() {
    this.src.pop();
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
  },
  
  while_do: function(classicalRegister, loopProgram) {
    var loopStart = unique_labeler;
    var loopBypass = unique_labeler + 1;
    unique_labeler += 2;
    
    this.src.push('LABEL @START' + loopStart);
    this.src.push('JUMP-UNLESS @END' + loopBypass + ' [' + validInt(classicalRegister) + ']');
    this.src.push(loopProgram);
    this.src.push('JUMP @START' + loopStart);
    this.src.push('LABEL @END' + loopBypass);
  },
  
  if_then: function(classicalRegister, thenProgram, elseProgram) {
    var ifStart = unique_labeler;
    var ifEnd = unique_labeler + 1;
    unique_labeler += 2;
    
    this.src.push('JUMP-WHEN @THEN' + ifStart + ' [' + validInt(classicalRegister) + ']');
    this.src.push(elseProgram);
    this.src.push('JUMP @END' + ifEnd);
    this.src.push('LABEL @THEN' + ifStart)
    this.src.push(thenProgram);
    this.src.push('LABEL @END' + ifEnd);
  }
};

// not supporting: wavefunction

var QVM = function(connection) {
  if (connection) {
    // store and validate endpoint
    this.connection = connection;
    if (!this.connection.ENDPOINT || !this.connection.API_KEY) {
      throw Error('Connection object did not contain an Endpoint and an API Key');
    }
  }
};
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
    this.classical_indexes = classical_indexes.map(validInt);

    let responses = [];
    if (!iterations || isNaN(iterations * 1)) {
      iterations = 1;
    }
    
    if (this.connection) {
      request.post({
        url: this.connection.ENDPOINT,
        headers: {
          'x-api-key': this.connection.API_KEY,
          'x-api-client': 'jsquil',
          'Accept': 'application/octet-stream'
        },
        json: {
          type: 'multishot',
          addresses: this.classical_indexes,
          trials: iterations,
          'quil-instructions': this.program.code() 
        }
      }, (err, response, body) => {
        callback(err, body);
      });
      return;
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
  },
  
  wavefunction: function() {
    // debugging function on VMs
  }
};

var Connection = function(key, endpoint) {
  this.ENDPOINT = endpoint || 'https://api.rigetti.com/qvm';
  this.API_KEY = key;
  if (!this.API_KEY) {
    throw Error('No API Key was provided');
  }
};
Connection.prototype = {

};

module.exports = {
  gates: gates,
  inits: inits,
  Program: Program,
  QVM: QVM,
  Connection: Connection
};