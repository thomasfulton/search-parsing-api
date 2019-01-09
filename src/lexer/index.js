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
 * Reads and tokenizes the next string until a terminating character.
 *
 * @param {*} input
 * @returns The next string
 */
function nextString(input) {
  let pos = 0;
  let value = "";
  while (!isTerminating(input.charAt(pos))) {
    value += input.charAt(pos);
    pos++;
  }
  return [{ type: "STRING", value }, pos];
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

  if (input.substring(0, 5) === " AND ") {
    return [{ type: "AND" }, 5];
  }

  if (input.substring(0, 4) === " OR ") {
    return [{ type: "OR" }, 4];
  }

  if (input.charAt(0) === " ") {
    return [{ type: "AND" }, 1];
  }

  return nextString(input);
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

module.exports = { lex, nextToken, nextString, isTerminating };
