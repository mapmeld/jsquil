const utils = require('./utils.js');

module.exports = {
  H: (qubit_index) => {
    // apply H-gate to qubit-index
    return {
      qubit: utils.validInt(qubit_index),
      code: 'H ' + qubit_index
    };
  },
  
  I: (qubit_index) => {
    // apply I-gate to qubit-index
    return {
      qubit: utils.validInt(qubit_index),
      code: 'I ' + qubit_index
    };
  },
  
  S: function(qubit_index) {
    // apply S-gate to qubit-index
    return {
      qubit: utils.validInt(qubit_index),
      code: 'S ' + qubit_index
    };
  },
  
  T: function(qubit_index) {
    // apply T-gate to qubit-index
    return {
      qubit: utils.validInt(qubit_index),
      code: 'T ' + qubit_index
    };
  },
  
  X: function(qubit_index) {
    // apply X-gate to qubit-index
    return {
      qubit: utils.validInt(qubit_index),
      code: 'X ' + qubit_index
    };
  },
  
  Y: function(qubit_index) {
    // apply Y-gate to qubit-index
    return {
      qubit: utils.validInt(qubit_index),
      code: 'Y ' + qubit_index
    };
  },
  
  Z: function(qubit_index) {
    // apply Z-gate to qubit-index
    return {
      qubit: utils.validInt(qubit_index),
      code: 'Z ' + qubit_index
    };
  },
  
  PHASE: function(phase, qubit_index) {
    // same as the RZ gate
    phase = utils.validAngle(phase);
    return {
      phase: phase,
      qubit: utils.validInt(qubit_index),
      code: 'PHASE(' + phase + ') ' + qubit_index
    };
  },
  CPHASE00: function(phase, qubit_a, qubit_b) {
    phase = utils.validAngle(phase);
    let gate = {
      phase: phase,
      qubits: [utils.validInt(qubit_a), utils.validInt(qubit_b)],
    };
    gate.code = 'CPHASE00(' + phase + ') ' + gate.qubits.join(' ');
    return gate;
  },
  CPHASE01: function(phase, qubit_a, qubit_b) {
    phase = utils.validAngle(phase);
    let gate = {
      phase: phase,
      qubits: [utils.validInt(qubit_a), utils.validInt(qubit_b)],
    };
    gate.code = 'CPHASE01(' + phase + ') ' + gate.qubits.join(' ');
    return gate;
  },
  CPHASE10: function(phase, qubit_a, qubit_b) {
    phase = utils.validAngle(phase);
    let gate = {
      phase: phase,
      qubits: [utils.validInt(qubit_a), utils.validInt(qubit_b)],
    };
    gate.code = 'CPHASE10(' + phase + ') ' + gate.qubits.join(' ');
    return gate;
  },
  CPHASE: function(phase, qubit_a, qubit_b) {
    // same as CPHASE00 ?
    phase = utils.validAngle(phase);
    let gate = {
      phase: phase,
      qubits: [utils.validInt(qubit_a), utils.validInt(qubit_b)],
    };
    gate.code = 'CPHASE(' + phase + ') ' + gate.qubits.join(' ');
    return gate;
  },
  RX: function(phase, qubit_index) {
    phase = utils.validAngle(phase);
    return {
      phase: phase,
      qubit: utils.validInt(qubit_index),
      code: 'RX(' + phase + ') ' + qubit_index
    };
  },
  RY: function(phase, qubit_index) {
    phase = utils.validAngle(phase);
    return {
      phase: phase,
      qubit: utils.validInt(qubit_index),
      code: 'RY(' + phase + ') ' + qubit_index
    };
  },
  RZ: function(phase, qubit_index) {
    phase = utils.validAngle(phase);
    return {
      phase: phase,
      qubit: utils.validInt(qubit_index),
      code: 'RZ(' + phase + ') ' + qubit_index
    };
  },
  CNOT: function(qubit_a, qubit_b) {
    return {
      qubits: [utils.validInt(qubit_a), utils.validInt(qubit_b)],
      code: 'CNOT ' + qubit_a + ' ' + qubit_b
    };
  },
  CCNOT: function(qubit_a, qubit_b, qubit_c) {
    let gate = {
      qubits: [
        utils.validInt(qubit_a),
        utils.validInt(qubit_b),
        utils.validInt(qubit_c)
      ]
    };
    gate.code = 'CCNOT ' + gate.qubits.join(' ');
    return gate;
  },
  SWAP: function(qubit_a, qubit_b) {
    return {
      qubits: [utils.validInt(qubit_a), utils.validInt(qubit_b)],
      code: 'SWAP ' + qubit_a + ' ' + qubit_b
    };
  },
  CSWAP: function(qubit_a, qubit_b, qubit_c) {
    let gate = {
      qubits: [
        utils.validInt(qubit_a),
        utils.validInt(qubit_b),
        utils.validInt(qubit_c)
      ]
    };
    gate.code = 'CSWAP ' + gate.qubits.join(' ');
    return gate;
  },
  ISWAP: function(qubit_a, qubit_b) {
    return {
      qubits: [utils.validInt(qubit_a), utils.validInt(qubit_b)],
      code: 'ISWAP ' + qubit_a + ' ' + qubit_b
    };
  },
  PSWAP: function(phase, qubit_a, qubit_b) {
    phase = utils.validAngle(phase);
    return {
      qubits: [
        utils.validInt(qubit_a),
        utils.validInt(qubit_b)
      ],
      code: 'PSWAP(' + phase + ') ' + qubit_a + ' ' + qubit_b
    };
  }
};