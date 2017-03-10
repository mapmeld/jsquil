// initializations and operations on classical registers
const utils = require('./utils.js');

var inits = {
  TRUE: (classical_index) => {
    return {
      classical_index: utils.validInt(classical_index),
      code: 'TRUE [' + classical_index + ']'
    };
  },
  FALSE: (classical_index) => {
    return {
      classical_index: utils.validInt(classical_index),
      code: 'FALSE [' + classical_index + ']'
    };
  },
};

var operations = {
  NOT: (classical_index) => {
    return {
      classical_index: utils.validInt(classical_index),
      code: 'NOT [' + classical_index + ']'
    };
  },
  AND: (classical_a, classical_b) => {
    return {
      classical_indexes: [
        utils.validInt(classical_a),
        utils.validInt(classical_b)
      ],
      code: 'AND [' + classical_a + '] [' + classical_b + ']'
    };
  },
  OR: (classical_a, classical_b) => {
    return {
      classical_indexes: [
        utils.validInt(classical_a),
        utils.validInt(classical_b)
      ],
      code: 'OR [' + classical_a + '] [' + classical_b + ']'
    };
  },
  MOVE: (classical_a, classical_b) => {
    return {
      classical_indexes: [
        utils.validInt(classical_a),
        utils.validInt(classical_b)
      ],
      code: 'MOVE [' + classical_a + '] [' + classical_b + ']'
    };
  },
  EXCHANGE: (classical_a, classical_b) => {
    return {
      classical_indexes: [
        utils.validInt(classical_a),
        utils.validInt(classical_b)
      ],
      code: 'EXCHANGE [' + classical_a + '] [' + classical_b + ']'
    };
  }
};

module.exports = {
  inits: inits,
  operations: operations
};