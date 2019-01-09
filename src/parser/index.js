const tokenPrecedence = [
  { type: "OPEN_PAREN" },
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
  return isType(token, ["("]);
}

function isCloseParen(token) {
  return isType(token, [")"]);
}

// Returns 1 if op1 has greater precedence than op2, -1 if op1 has lesser
// precedence, and 0 if they have the same precedence.
function precedence(op1, op2) {
  if (op1.type === "OR" && op2.type === "AND") {
    return -1;
  } else if (op1.type === "AND" && op2.type === "OR") {
    return 1;
  } else {
    return 0;
  }
}

function pushOperatorToOutputStack(operator, outputStack) {
  outputStack.push(
    Object.assign(
      { children: [outputStack.pop(), outputStack.pop()] },
      operator
    )
  );
}

// This uses a modified shunting-yard algorithm to build an AST.
// https://en.wikipedia.org/wiki/Shunting-yard_algorithm
function parse(input) {
  let operatorStack = [];
  let outputStack = [];

  while (input.length !== 0) {
    const token = input.shift();

    console.log("token:", JSON.stringify(token));

    if (isLiteral(token)) {
      outputStack.push(token);
      continue;
    }

    if (isOperator(token)) {
      while (
        operatorStack.length > 0 &&
        precedence(token, operatorStack[0]) < 0
      ) {
        pushOperatorToOutputStack(operatorStack.pop(), outputStack);
      }

      operatorStack.push(token);
      continue;
    }

    if (isOpenParen(token)) {
      operatorStack.push(token);
      continue;
    }

    if (isCloseParen(token)) {
      while (operatorStack.length > 0 && !isOpenParen(operatorStack[0])) {
        pushOperatorToOutputStack(operatorStack.pop(), outputStack);
      }
      if (isOpenParen(operatorStack[0])) {
        operatorStack.pop();
      } else {
        throw new Error("BRACKET_MISMATCH");
      }
      continue;
    }

    console.log("operator stack:", JSON.stringify(operatorStack));
    console.log("output stack:", JSON.stringify(outputStack));
    console.log("-----------------");
  }

  while (operatorStack.length > 0) {
    pushOperatorToOutputStack(operatorStack.pop(), outputStack);

    console.log("operator stack:", JSON.stringify(operatorStack));
    console.log("outputStack:", JSON.stringify(outputStack));
    console.log("-----------------");
  }

  if (
    outputStack.length !== 1 ||
    operatorStack.length !== 0 ||
    input.length !== 0
  ) {
    throw new Error("INVALID_EXPRESSION");
  }

  return outputStack[0];
}

module.exports = {
  parse,
};
