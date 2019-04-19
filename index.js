const request = require('request');

const gates = require('./gates.js');
const utils = require('./utils.js');
const classicals = require('./classicals.js');
const inits = classicals.inits;
const operations = classicals.operations;

// for working with tests, not for actual connections to QVM
var qubits = [];
var classical_bits = [];
var valueOfQubit = function(qubit_index) {
  return qubits[qubit_index] || 0;
};
var valueOfClassical = function(classical_index) {
  return classical_bits[classical_index] || 0;
};

// not supporting: defgate
var unique_labeler = 1;

var Program = function() {
  this.src = [];
};
Program.prototype = {
  maxClassicalBit: 0,

  inst: function() {
    for (var i in arguments) {
      var formed_instruction = arguments[i];
      this.src.push(formed_instruction);
    }
  },

  measure: function(qubit_index, classical_index) {
    this.maxClassicalBit = Math.max(this.maxClassicalBit, utils.validInt(classical_index));
    this.src.push('MEASURE ' + utils.validInt(qubit_index) + ' ro[' + utils.validInt(classical_index) + ']');
  },

  wait: function() {
    this.src.push('WAIT');
  },

  reset: function() {
    this.src.push('RESET');
  },

  nop: function() {
    this.src.push('NOP');
  },

  halt: function() {
    this.src.push('HALT');
  },

  code: function(isEmbedded) {
    var quil = '';
    for (var a = 0; a < this.src.length; a++) {
      var codeComponent = this.src[a];
      if (typeof codeComponent === 'object') {
        if (typeof codeComponent.code === 'function') {
          // embedded program
          quil += codeComponent.code(true);
        } else {
          quil += codeComponent.code + '\n';
        }
        if (codeComponent.maxClassicalBit) {
          this.maxClassicalBit = Math.max(this.maxClassicalBit, codeComponent.maxClassicalBit);
        }
      } else {
        quil += this.src[a] + '\n';
      }
    }
    var prefix = isEmbedded ? '' : 'DECLARE ro BIT[' + (this.maxClassicalBit + 1) + ']\n';
    return prefix + quil;
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
    classicalRegister = utils.validInt(classicalRegister);
    this.maxClassicalRegister = Math.max(this.maxClassicalRegister, classicalRegister);

    var loopStart = unique_labeler;
    var loopBypass = unique_labeler + 1;
    unique_labeler += 2;

    this.src.push('LABEL @START' + loopStart);
    this.src.push('JUMP-UNLESS @END' + loopBypass + ' ro[' + classicalRegister + ']');
    this.src.push(loopProgram);
    this.src.push('JUMP @START' + loopStart);
    this.src.push('LABEL @END' + loopBypass);
  },

  if_then: function(classicalRegister, thenProgram, elseProgram) {
    classicalRegister = utils.validInt(classicalRegister);
    this.maxClassicalRegister = Math.max(this.maxClassicalRegister, classicalRegister);

    var ifStart = unique_labeler;
    var ifEnd = unique_labeler + 1;
    unique_labeler += 2;

    this.src.push('JUMP-WHEN @THEN' + ifStart + ' ro[' + classicalRegister + ']');
    this.src.push(elseProgram);
    this.src.push('JUMP @END' + ifEnd);
    this.src.push('LABEL @THEN' + ifStart)
    this.src.push(thenProgram);
    this.src.push('LABEL @END' + ifEnd);
  }
};

// not supporting: wavefunction

var QVM = function(connection, gate_noise, measure_noise) {
  if (connection) {
    // store and validate endpoint
    this.connection = connection;
    if (!this.connection.ENDPOINT || !this.connection.USER_ID || !this.connection.API_KEY) {
      throw Error('Connection object did not contain an Endpoint, a User ID, and an API Key');
    }
  }

  // store and validate noise
  if (gate_noise) {
    if (gate_noise.length === 3) {
      this.gate_noise = gate_noise.map(utils.validInt);
    } else {
      throw Error ('Gate noise was not specified correctly [Px, Py, Pz]');
    }
  }
  if (measure_noise) {
    if (measure_noise.length === 3) {
      this.measure_noise = measure_noise.map(utils.validInt);
    } else {
      throw Error ('Measure noise was not specified correctly [Px, Py, Pz]');
    }
  }
};
QVM.prototype = {
  runOnce: function(callback) {
    let maxClassicalIndex = this.program.maxClassicalIndex;
    this.program.run(function(err) {
      if (err) {
        return callback(err);
      }

      var returns = new Array(maxClassicalIndex);
      callback(null, returns);
    });
  },

  run: function(program, iterations, callback) {
    this.program = program;

    let responses = [];
    if (!iterations || isNaN(iterations * 1)) {
      iterations = 1;
    }

    if (this.connection) {
      let payload = {
        type: 'multishot-measure',
        qubits: [0, 1, 2, 3],
        trials: iterations,
        'quil-instructions': this.program.code()
      };
      // if (this.gate_noise) {
      //   payload['gate-noise'] = this.gate_noise;
      // }
      // if (this.measure_noise) {
      //   payload['measurement-noise'] = this.measure_noise;
      // }
      console.log(this.connection.ENDPOINT);

      request.post({
        url: this.connection.ENDPOINT,
        headers: {
          //'X-Api-Key': this.connection.API_KEY,
          //'X-User-Id': this.connection.USER_ID,
          'Content-Type': 'application/json; charset=utf-8',
          'Accept': 'application/octet-stream'
        },
        json: payload
      }, (err, response, body) => {
        callback(body);
      });
      return;
    }

    var runMe = (function(i) {
      if (i >= iterations) {
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

var Connection = function(key, endpoint) {
  this.ENDPOINT = endpoint || 'https://forest-server.qcs.rigetti.com';

  if (typeof key !== 'object') {
    throw Error('The API now requires both a User ID and an API Key');
  }

  this.API_KEY = key.api_key;
  this.USER_ID = key.user_id;
  if (!this.API_KEY) {
    throw Error('No API Key was provided');
  }
  if (!this.USER_ID) {
    throw Error('No User ID was provided');
  }
};
Connection.prototype = {};

module.exports = {
  gates: gates,
  operations: operations,
  inits: inits,
  Program: Program,
  QVM: QVM,
  Connection: Connection
};
