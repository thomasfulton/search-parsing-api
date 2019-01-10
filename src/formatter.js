/**
 * Changes the format of a parsed AST to a format for the API response.
 *
 * @param {*} input A parsed AST.
 * @returns A js object formatted for the API response
 */
function format(input) {
  switch (input.type) {
    case "AND":
      return { $and: input.children.map(format) };
    case "OR":
      return { $or: input.children.map(format) };
    case "FLOAT":
      return input.value;
    case "INT":
      return input.value;
    case "BOOLEAN":
      return input.value;
    case "STRING":
      return input.value;
    case "QUOTED":
      return { $quoted: input.value };
    case "LENGTH":
      return { $length: input.value };
    case "EQ":
      return { $eq: input.value };
    case "GT":
      return { $gt: input.value };
    case "LT":
      return { $lt: input.value };
    case "GE":
      return { $ge: input.value };
    case "LE":
      return { $le: input.value };
    case "NOT":
      return { $not: input.value };
    default:
      throw new Error("INVALID_FORMATTER_INPUT");
  }
}

module.exports = { format };
