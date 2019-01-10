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
        ])
      ).to.deep.equal({
        children: [
          {
            children: [
              {
                children: [
                  {
                    children: [
                      { type: "LT", value: { type: "FLOAT", value: 3.5 } },
                      { type: "GT", value: { type: "INT", value: 4 } },
                    ],
                    type: "AND",
                  },
                  { type: "LE", value: { type: "FLOAT", value: 5.5 } },
                ],
                type: "AND",
              },
              { type: "GE", value: { type: "INT", value: 6 } },
            ],
            type: "AND",
          },
          { type: "EQ", value: { type: "FLOAT", value: 7.5 } },
        ],
        type: "AND",
      });
    });
  });
});
