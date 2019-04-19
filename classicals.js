// initializations and operations on classical registers
const utils = require('./utils.js');

var inits = {
  TRUE: (classical_index) => {
    classical_index = utils.validInt(classical_index);
    return {
      classical_index: classical_index,
      maxClassicalBit: classical_index,
      code: 'TRUE ro[' + classical_index + ']'
    };
  },
  FALSE: (classical_index) => {
    classical_index = utils.validInt(classical_index);
    return {
      classical_index: classical_index,
      maxClassicalBit: classical_index,
      code: 'FALSE ro[' + classical_index + ']'
    };
  },
};

var operations = {
  NOT: (classical_index) => {
    classical_index = utils.validInt(classical_index);
    return {
      classical_index: classical_index,
      maxClassicalBit: classical_index,
      code: 'NOT ro[' + classical_index + ']'
    };
  },
  AND: (classical_a, classical_b) => {
    classical_a = utils.validInt(classical_a);
    classical_b = utils.validInt(classical_b);
    return {
      classical_indexes: [classical_a, classical_b],
      maxClassicalBit: Math.max(classical_a, classical_b),
      code: 'AND ro[' + classical_a + '] ro[' + classical_b + ']'
    };
  },
  OR: (classical_a, classical_b) => {
    classical_a = utils.validInt(classical_a);
    classical_b = utils.validInt(classical_b);
    return {
      classical_indexes: [classical_a, classical_b],
      maxClassicalBit: Math.max(classical_a, classical_b),
      code: 'OR ro[' + classical_a + '] ro[' + classical_b + ']'
    };
  },
  MOVE: (classical_a, classical_b) => {
    classical_a = utils.validInt(classical_a);
    classical_b = utils.validInt(classical_b);
    return {
      classical_indexes: [classical_a, classical_b],
      maxClassicalBit: Math.max(classical_a, classical_b),
      code: 'MOVE ro[' + classical_a + '] ro[' + classical_b + ']'
    };
  },
  EXCHANGE: (classical_a, classical_b) => {
    classical_a = utils.validInt(classical_a);
    classical_b = utils.validInt(classical_b);
    return {
      classical_indexes: [classical_a, classical_b],
      maxClassicalBit: Math.max(classical_a, classical_b),
      code: 'EXCHANGE ro[' + classical_a + '] ro[' + classical_b + ']'
    };
  }
};

module.exports = {
  inits: inits,
  operations: operations
};
