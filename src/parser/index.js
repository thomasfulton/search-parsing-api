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
  AND: 500,
  OR: 400,
};

function isType(token, types) {
  return types.includes(token.type);
}

function isLiteral(token) {
  return isType(token, ["STRING", "INT", "FLOAT"]);
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

function createNode(operatorStack, outputStack) {
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
};

// This uses a modified shunting-yard algorithm to build an AST.
// https://en.wikipedia.org/wiki/Shunting-yard_algorithm
function parse(input) {
  let operatorStack = [];
  let outputStack = [];

  while (input.length !== 0) {
    const token = input.shift();

    console.log("token:", JSON.stringify(token, null, 2));

    if (isLiteral(token)) {
      outputStack.push(token);
    }

    if (isOperator(token)) {
      while (
        peek(operatorStack) &&
        precedence(peek(operatorStack), token) >= 0
      ) {
        createNode(operatorStack, outputStack);
      }

      operatorStack.push(token);
    }

    if (isOpenParen(token)) {
      operatorStack.push(token);
    }

    if (isCloseParen(token)) {
      while (peek(operatorStack) && !isOpenParen(peek(operatorStack))) {
        createNode(operatorStack, outputStack);
      }
      if (isOpenParen(peek(operatorStack))) {
        operatorStack.pop();
      } else {
        throw new Error("BRACKET_MISMATCH");
      }
    }

    console.log("operator stack:", JSON.stringify(operatorStack, null, 2));
    console.log("output stack:", JSON.stringify(outputStack, null, 2));
    console.log("-----------------");
  }

  console.log("*** INPUT EMPTY *** ");
  console.log("-----------------");

  while (operatorStack.length > 0) {
    createNode(operatorStack, outputStack);

    console.log("operator stack:", JSON.stringify(operatorStack, null, 2));
    console.log("outputStack:", JSON.stringify(outputStack, null, 2));
    console.log("-----------------");
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
