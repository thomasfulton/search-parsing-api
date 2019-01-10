const tokenPrecedence = [
  { OPEN_PAREN: "OPEN_PAREN" },
  { type: "CLOSE_PAREN" },
  { type: "NOT" },
  { type: "GE" },
  { type: "LE" },
  { type: "EQ" },
  { type: "GT" },
  { type: "LT" },
  { type: "AND" },
  { type: "OR" },
  { type: "LEN" },
  { type: "QUOTE" },
  { type: "AND" },
  { type: "BOOLEAN" },
  { type: "INT" },
  { type: "FLOAT" },
  { type: "STRING" },
];

const OPERATOR_PRECEDENCE = {
  OPEN_PAREN: 0,
  CLOSE_PAREN: 0,
  OR: 400,
  AND: 500,
};

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

    // console.log("token:", JSON.stringify(token, null, 2));

    if (isLiteral(token)) {
      outputStack.push(token);
    }

    if (isUnaryOperator(token)) {
      if (isLength(token)) {
        const v1 = input.shift();
        const v2 = input.shift();
        const v3 = input.shift();
        if (isOpenParen(v1) && isInteger(v2) && isCloseParen(v3)) {
          outputStack.push(Object.assign(token, { value: v2.value }));
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
        const value = input.shift();
        if (!isNumber(value)) {
          throw new Error("ARGUMENT_NOT_NUMBER");
        }
        outputStack.push(Object.assign(token, { value }));
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

    // console.log("operator stack:", JSON.stringify(operatorStack, null, 2));
    // console.log("output stack:", JSON.stringify(outputStack, null, 2));
    // console.log("-----------------");
  }

  // console.log("*** INPUT EMPTY *** ");
  // console.log("-----------------");

  while (operatorStack.length > 0) {
    createBinaryNode(operatorStack, outputStack);

    // console.log("operator stack:", JSON.stringify(operatorStack, null, 2));
    // console.log("outputStack:", JSON.stringify(outputStack, null, 2));
    // console.log("-----------------");
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
