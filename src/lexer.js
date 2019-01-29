/**
 * Determines if character should terminate a string.
 *
 * @param {*} input
 * @returns If the character is a terminating character.
 */
function isTerminating(char) {
  return ["", " ", ")", '"'].includes(char);
}

/**
 * Reads and tokenizes the next literal until a terminating character.
 *
 * @param {*} input
 */
function nextLiteral(input) {
  let pos = 0;
  let value = "";
  while (!isTerminating(input.charAt(pos))) {
    value += input.charAt(pos);
    pos++;
  }

  if (value === "true") {
    return [{ type: "BOOLEAN", value: true }, pos];
  }
  if (value === "false") {
    return [{ type: "BOOLEAN", value: false }, pos];
  }
  if (!isNaN(value)) {
    const number = Number(value);
    if (Number.isInteger(number)) {
      return [{ type: "INT", value: number }, pos];
    } else {
      return [{ type: "FLOAT", value: number }, pos];
    }
  }
  return [{ type: "STRING", value }, pos];
}

/**
 * Reads and tokenizes the next literal until an end quote.
 *
 * @param {*} input
 */

function nextQuotedString(input) {
  let pos = 1;
  let value = "";
  while (input.charAt(pos) !== `"`) {
    value += input.charAt(pos);
    pos++;

    if (pos >= input.length) {
      throw new Error("MISMATCHED_QUOTES");
    }
  }
  return [{ type: "QUOTED", value }, pos + 1];
}

/**
 * Returns the next token from an input string.
 *
 * @param {*} input
 * @returns Array of [token, number of characters consumed]
 */
function nextToken(input) {
  if (input.charAt(0) === "(") {
    return [{ type: "OPEN_PAREN" }, 1];
  }

  if (input.charAt(0) === ")") {
    return [{ type: "CLOSE_PAREN" }, 1];
  }

  if (input.charAt(0) === "!") {
    return [{ type: "NOT" }, 1];
  }

  if (input.substring(0, 2) === ">=") {
    return [{ type: "GE" }, 2];
  }

  if (input.substring(0, 2) === "<=") {
    return [{ type: "LE" }, 2];
  }

  if (input.charAt(0) === "=") {
    return [{ type: "EQ" }, 1];
  }

  if (input.charAt(0) === ">") {
    return [{ type: "GT" }, 1];
  }

  if (input.charAt(0) === "<") {
    return [{ type: "LT" }, 1];
  }

  if (input.substring(0, 5) === " AND ") {
    return [{ type: "AND" }, 5];
  }

  if (input.substring(0, 4) === " OR ") {
    return [{ type: "OR" }, 4];
  }

  if (input.substring(0, 3) === "len") {
    return [{ type: "LENGTH" }, 3];
  }

  if (input.charAt(0) === `"`) {
    return nextQuotedString(input);
  }

  if (input.charAt(0) === " ") {
    return [{ type: "AND" }, 1];
  }

  return nextLiteral(input);
}

/**
 * Turns an input string into an array of tokens.
 *
 * @param {*} input
 * @returns Array of tokens.
 */
function lex(input) {
  if (input === "") {
    return [];
  }
  const next = nextToken(input);
  return [next[0]].concat(lex(input.substring(next[1])));
}

module.exports = {
  lex,
  nextToken,
  nextLiteral,
  nextQuotedString,
  isTerminating,
};
