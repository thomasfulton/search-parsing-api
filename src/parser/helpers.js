function isType(token, types) {
  return types.includes(token.type);
}

function isLiteral(token) {
  return isType(token, ["STRING", "INT", "FLOAT", "BOOLEAN", "QUOTED"]);
}

function isOperator(token) {
  return isType(token, ["AND", "OR"]);
}

function isOpenParen(token) {
  return isType(token, ["OPEN_PAREN"]);
}

function isCloseParen(token) {
  return isType(token, ["CLOSE_PAREN"]);
}

function isLength(token) {
  return isType(token, ["LENGTH"]);
}

function isNot(token) {
  return isType(token, ["NOT"]);
}

function isUnaryOperator(token) {
  return isType(token, ["LT", "GT", "LE", "GE", "EQ", "LENGTH", "NOT"]);
}

function isNumber(token) {
  return isType(token, ["FLOAT", "INT"]);
}

function isInteger(token) {
  return isType(token, ["INT"]);
}

function isBoolean(token) {
  return isType(token, ["BOOLEAN"]);
}

module.exports = {
  isLiteral,
  isOperator,
  isOpenParen,
  isCloseParen,
  isLength,
  isNot,
  isUnaryOperator,
  isNumber,
  isInteger,
  isBoolean,
};
