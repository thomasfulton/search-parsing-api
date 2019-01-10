const { lex } = require("../lexer");
const { parse } = require("../parser");
const { format } = require("../formatter");

function post(req, res) {
  const input = req.body.input;
  return res.json(format(parse(lex(input))));
}

module.exports = { post };
