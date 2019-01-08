const { expect } = require("chai");
const lexer = require("../../src/lexer");

describe("lexer", () => {
  it("works", () => {
    expect(lexer.lex(`error OR info`)).to.deep.equal([
      { type: "STRING", value: "error" },
      { type: "OR" },
      { type: "STRING", value: "info" },
    ]);

    expect(lexer.lex(`="TEST DATA" OR >len(9)`)).to.deep.equal([
      { type: "EQ" },
      { type: "QUOT" },
      { type: "STRING", value: "TEST DATA" },
      { type: "QUOT" },
      { type: "OR" },
      { type: "GT" },
      { type: "LEN" },
      { type: "OP" },
      { type: "INT", value: 9 },
      { type: "CP" },
    ]);

    expect(lexer.lex(`!false`)).to.deep.equal([
      { type: "NOT" },
      { type: "BOOL", value: false },
    ]);
  });
});
