const { expect } = require("chai");
const {
  lex,
  nextToken,
  nextLiteral,
  nextQuotedString,
  isTerminating,
} = require("../../src/lexer");

describe("lexer", () => {
  describe("isTerminating()", () => {
    it("determines terminating character correctly", () => {
      expect(isTerminating(" ")).to.be.true;
      expect(isTerminating(")")).to.be.true;
      expect(isTerminating('"')).to.be.true;
      expect(isTerminating("a")).to.be.false;
    });
  });

  describe("nextLiteral()", () => {
    it("returns the next literal", () => {
      expect(nextLiteral("test")).to.deep.equal([
        { type: "STRING", value: "test" },
        4,
      ]);
      expect(nextLiteral("test1 test2")).to.deep.equal([
        { type: "STRING", value: "test1" },
        5,
      ]);
      expect(nextLiteral("test1) test2")).to.deep.equal([
        { type: "STRING", value: "test1" },
        5,
      ]);
      expect(nextLiteral(`test1" test2`)).to.deep.equal([
        { type: "STRING", value: "test1" },
        5,
      ]);
    });
  });

  describe("nextQuotedString()", () => {
    it("returns the next quoted string", () => {
      expect(nextQuotedString(`"test1" AND test2`)).to.deep.equal([
        { type: "QUOTED", value: "test1" },
        7,
      ]);
    });
    it("fails on mismatched quote", () => {
      expect(() => nextQuotedString(`"test1 AND test2`)).to.throw(
        "MISMATCHED_QUOTES"
      );
    });
  });

  describe("nextToken()", () => {
    it("returns the next token", () => {
      expect(nextToken("test test")).to.deep.equal([
        { type: "STRING", value: "test" },
        4,
      ]);
      expect(nextToken("(test test)")).to.deep.equal([
        { type: "OPEN_PAREN" },
        1,
      ]);
      expect(nextToken(")")).to.deep.equal([{ type: "CLOSE_PAREN" }, 1]);
      expect(nextToken(" AND test")).to.deep.equal([{ type: "AND" }, 5]);
      expect(nextToken(" OR test")).to.deep.equal([{ type: "OR" }, 4]);
      expect(nextToken(`"test"`)).to.deep.equal([
        { type: "QUOTED", value: "test" },
        6,
      ]);
      expect(nextToken("35")).to.deep.equal([{ type: "INT", value: 35 }, 2]);
      expect(nextToken("4.63")).to.deep.equal([
        { type: "FLOAT", value: 4.63 },
        4,
      ]);
      expect(nextToken(">=")).to.deep.equal([{ type: "GE" }, 2]);
      expect(nextToken("<=")).to.deep.equal([{ type: "LE" }, 2]);
      expect(nextToken(">")).to.deep.equal([{ type: "GT" }, 1]);
      expect(nextToken("<")).to.deep.equal([{ type: "LT" }, 1]);
      expect(nextToken("=")).to.deep.equal([{ type: "EQ" }, 1]);
      expect(nextToken("!false")).to.deep.equal([{ type: "NOT" }, 1]);
      expect(nextToken("len(5)")).to.deep.equal([{ type: "LEN" }, 3]);
    });
  });

  describe("lex()", () => {
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

    it("lexes quoted string", () => {
      expect(lex(`"test"`)).to.deep.equal([{ type: "QUOTED", value: "test" }]);
    });

    it("lexes boolean", () => {
      expect(lex("false")).to.deep.equal([{ type: "BOOLEAN", value: false }]);
      expect(lex("true")).to.deep.equal([{ type: "BOOLEAN", value: true }]);
    });

    it("lexes float", () => {
      expect(lex("3.5")).to.deep.equal([{ type: "FLOAT", value: 3.5 }]);
    });

    it("lexes int", () => {
      expect(lex("35")).to.deep.equal([{ type: "INT", value: 35 }]);
    });

    it("lexes operators", () => {
      expect(lex("=")).to.deep.equal([{ type: "EQ" }]);
      expect(lex(">")).to.deep.equal([{ type: "GT" }]);
      expect(lex("<")).to.deep.equal([{ type: "LT" }]);
      expect(lex(">=")).to.deep.equal([{ type: "GE" }]);
      expect(lex("<=")).to.deep.equal([{ type: "LE" }]);
    });

    it("lexes not", () => {
      expect(lex("!false")).to.deep.equal([
        { type: "NOT" },
        { type: "BOOLEAN", value: false },
      ]);
    });

    it("lexes length", () => {
      expect(lex("len(5)")).to.deep.equal([
        { type: "LEN" },
        { type: "OPEN_PAREN" },
        { type: "INT", value: 5 },
        { type: "CLOSE_PAREN" },
      ]);
    });
  });
});
