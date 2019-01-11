const { lex } = require("../lexer");
const { parse } = require("../parser");
const { format } = require("../formatter");

function post(req, res) {
  const input = req.body.input;
  try {
    return res.json({ output: format(parse(lex(input))) });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

module.exports = { post };
