const { expect } = require("chai");
const { parse } = require("../../src/parser");

describe("parser", () => {
  describe("parse()", () => {
    it("parses and correctly", () => {
      expect(
        parse([
          { type: "STRING", value: "test1" },
          { type: "AND" },
          { type: "STRING", value: "test2" },
        ])
      ).to.deep.equal({
        type: "AND",
        children: [
          { type: "STRING", value: "test1" },
          { type: "STRING", value: "test2" },
        ],
      });
    });
    it("parses literals correctly", () => {
      expect(
        parse([
          { type: "STRING", value: "test1" },
          { type: "AND" },
          { type: "INT", value: 3 },
          { type: "AND" },
          { type: "FLOAT", value: 3.5 },
          { type: "AND" },
          { type: "BOOLEAN", value: true },
          { type: "AND" },
          { type: "QUOTED", value: "test AND test" },
        ])
      ).to.deep.equal({
        children: [
          {
            children: [
              {
                children: [
                  {
                    children: [
                      { type: "STRING", value: "test1" },
                      { type: "INT", value: 3 },
                    ],
                    type: "AND",
                  },
                  { type: "FLOAT", value: 3.5 },
                ],
                type: "AND",
              },
              { type: "BOOLEAN", value: true },
            ],
            type: "AND",
          },
          { type: "QUOTED", value: "test AND test" },
        ],
        type: "AND",
      });
    });
    it("parses and/or with the right precedence", () => {
      expect(
        parse([
          { type: "STRING", value: "test1" },
          { type: "AND" },
          { type: "STRING", value: "test2" },
          { type: "OR" },
          { type: "STRING", value: "test3" },
        ])
      ).to.deep.equal({
        type: "OR",
        children: [
          {
            type: "AND",
            children: [
              { type: "STRING", value: "test1" },
              { type: "STRING", value: "test2" },
            ],
          },
          { type: "STRING", value: "test3" },
        ],
      });
    });
    it("parses multiple ands correctly", () => {
      expect(
        parse([
          { type: "STRING", value: "test1" },
          { type: "AND" },
          { type: "STRING", value: "test2" },
          { type: "AND" },
          { type: "STRING", value: "test3" },
        ])
      ).to.deep.equal({
        type: "AND",
        children: [
          {
            type: "AND",
            children: [
              { type: "STRING", value: "test1" },
              { type: "STRING", value: "test2" },
            ],
          },
          { type: "STRING", value: "test3" },
        ],
      });
    });
    it("parses multiple ors correctly", () => {
      expect(
        parse([
          { type: "STRING", value: "test1" },
          { type: "OR" },
          { type: "STRING", value: "test2" },
          { type: "OR" },
          { type: "STRING", value: "test3" },
        ])
      ).to.deep.equal({
        type: "OR",
        children: [
          {
            type: "OR",
            children: [
              { type: "STRING", value: "test1" },
              { type: "STRING", value: "test2" },
            ],
          },
          { type: "STRING", value: "test3" },
        ],
      });
    });
    it("parses brackets correctly", () => {
      expect(
        parse([
          { type: "STRING", value: "test1" },
          { type: "AND" },
          { type: "OPEN_PAREN" },
          { type: "STRING", value: "test2" },
          { type: "OR" },
          { type: "STRING", value: "test3" },
          { type: "CLOSE_PAREN" },
        ])
      ).to.deep.equal({
        type: "AND",
        children: [
          { type: "STRING", value: "test1" },
          {
            type: "OR",
            children: [
              { type: "STRING", value: "test2" },
              { type: "STRING", value: "test3" },
            ],
          },
        ],
      });
    });
    it("parses nested operators inside brackets correctly", () => {
      expect(
        parse([
          { type: "STRING", value: "test1" },
          { type: "AND" },
          { type: "OPEN_PAREN" },
          { type: "STRING", value: "test2" },
          { type: "OR" },
          { type: "STRING", value: "test3" },
          { type: "AND" },
          { type: "STRING", value: "test4" },
          { type: "CLOSE_PAREN" },
        ])
      ).to.deep.equal({
        type: "AND",
        children: [
          { type: "STRING", value: "test1" },
          {
            type: "OR",
            children: [
              { type: "STRING", value: "test2" },
              {
                type: "AND",
                children: [
                  { type: "STRING", value: "test3" },
                  { type: "STRING", value: "test4" },
                ],
              },
            ],
          },
        ],
      });
    });
    it("parses unary operators correctly", () => {
      expect(
        parse([
          { type: "LT" },
          { type: "FLOAT", value: 3.5 },
          { type: "AND" },
          { type: "GT" },
          { type: "INT", value: 4 },
          { type: "AND" },
          { type: "LE" },
          { type: "FLOAT", value: 5.5 },
          { type: "AND" },
          { type: "GE" },
          { type: "INT", value: 6 },
          { type: "AND" },
          { type: "EQ" },
          { type: "FLOAT", value: 7.5 },
          { type: "AND" },
          { type: "NOT" },
          { type: "BOOLEAN", value: false },
        ])
      ).to.deep.equal({
        children: [
          {
            children: [
              {
                children: [
                  {
                    children: [
                      {
                        children: [
                          { type: "LT", value: 3.5 },
                          { type: "GT", value: 4 },
                        ],
                        type: "AND",
                      },
                      { type: "LE", value: 5.5 },
                    ],
                    type: "AND",
                  },
                  { type: "GE", value: 6 },
                ],
                type: "AND",
              },
              { type: "EQ", value: 7.5 },
            ],
            type: "AND",
          },
          { type: "NOT", value: false },
        ],
        type: "AND",
      });
    });

    it("parses length operators correctly", () => {
      expect(
        parse([
          { type: "LENGTH" },
          { type: "OPEN_PAREN" },
          { type: "INT", value: 3 },
          { type: "CLOSE_PAREN" },
          { type: "AND" },
          { type: "STRING", value: "test" },
        ])
      ).to.deep.equal({
        type: "AND",
        children: [
          { type: "LENGTH", value: 3 },
          { type: "STRING", value: "test" },
        ],
      });
    });

    it("throws error on invalid input", () => {
      expect(() =>
        parse([{ type: "STRING", value: "test" }, { type: "AND" }])
      ).to.throw("BINARY_OPERATOR_MISMATCH_AND");
    });
  });
});
