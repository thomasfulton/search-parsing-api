const {
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
} = require("./helpers");

const OPERATOR_PRECEDENCE = {
  OPEN_PAREN: 0,
  CLOSE_PAREN: 0,
  OR: 400,
  AND: 500,
};

// Returns 1 if op1 has greater precedence than op2, -1 if op1 has lesser
// precedence, and 0 if they have the same precedence.
function precedence(op1, op2) {
  if (OPERATOR_PRECEDENCE[op1.type] > OPERATOR_PRECEDENCE[op2.type]) {
    return 1;
  } else if (OPERATOR_PRECEDENCE[op1.type] < OPERATOR_PRECEDENCE[op2.type]) {
    return -1;
  } else {
    return 0;
  }
}

function createBinaryNode(operatorStack, outputStack) {
  const o2 = outputStack.pop();
  const o1 = outputStack.pop();
  const operator = operatorStack.pop();
  if (isOpenParen(operator)) {
    throw new Error("BRACKET_MISMATCH");
  }
  if (!o1 || !o2) {
    throw new Error("BINARY_OPERATOR_MISMATCH_" + operator.type);
  }
  outputStack.push(Object.assign({ children: [o1, o2] }, operator));
}

function peek(array) {
  return array[array.length - 1];
}

// This uses a modified shunting-yard algorithm to build an AST.
// https://en.wikipedia.org/wiki/Shunting-yard_algorithm
function parse(input) {
  let operatorStack = [];
  let outputStack = [];

  while (input.length !== 0) {
    const token = input.shift();

    if (isLiteral(token)) {
      outputStack.push(token);
    }

    if (isUnaryOperator(token)) {
      if (isLength(token)) {
        const t1 = input.shift();
        const t2 = input.shift();
        const t3 = input.shift();
        if (isOpenParen(t1) && isInteger(t2) && isCloseParen(t3)) {
          outputStack.push(Object.assign(token, { value: t2.value }));
        } else {
          throw new Error("BAD_LENGTH_ARGS");
        }
      } else if (isNot(token)) {
        const next = input.shift();
        if (!isBoolean(next)) {
          throw new Error("ARGUMENT_NOT_BOOLEAN");
        }
        outputStack.push(Object.assign(token, { value: next.value }));
      } else {
        const next = input.shift();
        if (!isNumber(next)) {
          throw new Error("ARGUMENT_NOT_NUMBER");
        }
        outputStack.push(Object.assign(token, { value: next.value }));
      }
    }

    if (isOperator(token)) {
      while (
        peek(operatorStack) &&
        precedence(peek(operatorStack), token) >= 0
      ) {
        createBinaryNode(operatorStack, outputStack);
      }

      operatorStack.push(token);
    }

    if (isOpenParen(token)) {
      operatorStack.push(token);
    }

    if (isCloseParen(token)) {
      while (peek(operatorStack) && !isOpenParen(peek(operatorStack))) {
        createBinaryNode(operatorStack, outputStack);
      }
      if (isOpenParen(peek(operatorStack))) {
        operatorStack.pop();
      } else {
        throw new Error("BRACKET_MISMATCH");
      }
    }
  }

  while (operatorStack.length > 0) {
    createBinaryNode(operatorStack, outputStack);
  }

  if (
    outputStack.length !== 1 ||
    operatorStack.length !== 0 ||
    input.length !== 0
  ) {
    throw new Error("INVALID_EXPRESSION");
  }

  return outputStack.pop();
}

module.exports = {
  parse,
};
