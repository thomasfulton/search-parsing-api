const { expect } = require("chai");
const {
  lex,
  nextToken,
  nextString,
  isTerminating,
} = require("../../src/lexer");

describe("isTerminating", () => {
  it("determines terminating character correctly", () => {
    expect(isTerminating(" ")).to.be.true;
    expect(isTerminating(")")).to.be.true;
    expect(isTerminating('"')).to.be.true;
    expect(isTerminating("a")).to.be.false;
  });
});

describe("nextString", () => {
  it("returns the next string", () => {
    expect(nextString("test")).to.deep.equal([
      { type: "STRING", value: "test" },
      4,
    ]);
    expect(nextString("test1 test2")).to.deep.equal([
      { type: "STRING", value: "test1" },
      5,
    ]);
    expect(nextString("test1) test2")).to.deep.equal([
      { type: "STRING", value: "test1" },
      5,
    ]);
    expect(nextString(`test1" test2`)).to.deep.equal([
      { type: "STRING", value: "test1" },
      5,
    ]);
  });
});

describe("nextToken", () => {
  it("returns the next token", () => {
    expect(nextToken("test test")).to.deep.equal([
      { type: "STRING", value: "test" },
      4,
    ]);
    expect(nextToken("(test test)")).to.deep.equal([{ type: "OPEN_PAREN" }, 1]);
    expect(nextToken(")")).to.deep.equal([{ type: "CLOSE_PAREN" }, 1]);
    expect(nextToken(" AND test")).to.deep.equal([{ type: "AND" }, 5]);
    expect(nextToken(" OR test")).to.deep.equal([{ type: "OR" }, 4]);
  });
});

describe("lex", () => {
  it("lexes strings", () => {
    expect(lex("test")).to.deep.equal([{ type: "STRING", value: "test" }]);
  });

  it("lexes space", () => {
    expect(lex("test test")).to.deep.equal([
      { type: "STRING", value: "test" },
      { type: "AND" },
      { type: "STRING", value: "test" },
    ]);
  });

  it("lexes and", () => {
    expect(lex("test AND test")).to.deep.equal([
      { type: "STRING", value: "test" },
      { type: "AND" },
      { type: "STRING", value: "test" },
    ]);
  });

  it("lexes or", () => {
    expect(lex("test OR test")).to.deep.equal([
      { type: "STRING", value: "test" },
      { type: "OR" },
      { type: "STRING", value: "test" },
    ]);
  });

  it("lexes open paren", () => {
    expect(lex("(test")).to.deep.equal([
      { type: "OPEN_PAREN" },
      { type: "STRING", value: "test" },
    ]);
  });

  it("lexes close paren", () => {
    expect(lex(") test")).to.deep.equal([
      { type: "CLOSE_PAREN" },
      { type: "AND" },
      { type: "STRING", value: "test" },
    ]);
  });
});
