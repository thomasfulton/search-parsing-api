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

    // test1 AND (test2 OR test3)

    xit("parses brackets correctly", () => {
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
          { type: "STRING", value: "test" },
          {
            type: "OR",
            children: [
              { type: "STRING", value: "test" },
              { type: "STRING", value: "test" },
            ],
          },
        ],
      });
    });
    xit("parses nested operators inside brackets correctly", () => {
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
          { type: "STRING", value: "test" },
          {
            type: "OR",
            children: [
              { type: "STRING", value: "test" },
              {
                type: "AND",
                children: [
                  { type: "STRING", value: "test" },
                  { type: "STRING", value: "test" },
                ],
              },
            ],
          },
        ],
      });
    });
  });
});
