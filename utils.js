var validAngle = function(val) {
  val *= 1;
  if (isNaN(val)) {
    throw Error('Angle given is not a numeric value');
  }
  return val.toFixed(16) * 1;
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

module.exports = {
  validAngle: validAngle,
  validInt: validInt
};