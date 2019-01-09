const { expect } = require("chai");
const { parse } = require("../../src/parser");

describe("parser", () => {
  describe("parse()", () => {
    it("parses and correctly", () => {
      expect(
        parse([
          { type: "STRING", value: "test" },
          { type: "AND" },
          { type: "STRING", value: "test" },
        ])
      ).to.deep.equal({
        type: "AND",
        children: [
          { type: "STRING", value: "test" },
          { type: "STRING", value: "test" },
        ],
      });
    });
    it("parses and/or in the right order", () => {
      expect(
        parse([
          { type: "STRING", value: "test" },
          { type: "AND" },
          { type: "STRING", value: "test" },
          { type: "OR" },
          { type: "STRING", value: "test" },
        ])
      ).to.deep.equal({
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
      });
    });
    it("parses multiple ands correctly", () => {
      expect(
        parse([
          { type: "STRING", value: "test" },
          { type: "AND" },
          { type: "STRING", value: "test" },
          { type: "AND" },
          { type: "STRING", value: "test" },
        ])
      ).to.deep.equal({
        type: "AND",
        children: [
          {
            type: "AND",
            children: [
              { type: "STRING", value: "test" },
              { type: "STRING", value: "test" },
            ],
          },
          { type: "STRING", value: "test" },
        ],
      });
    });
    it("parses multiple ors correctly", () => {
      expect(
        parse([
          { type: "STRING", value: "test" },
          { type: "OR" },
          { type: "STRING", value: "test" },
          { type: "OR" },
          { type: "STRING", value: "test" },
        ])
      ).to.deep.equal({
        type: "OR",
        children: [
          {
            type: "OR",
            children: [
              { type: "STRING", value: "test" },
              { type: "STRING", value: "test" },
            ],
          },
          { type: "STRING", value: "test" },
        ],
      });
    });
    xit("parses brackets correctly", () => {
      expect(
        parse([
          { type: "STRING", value: "test" },
          { type: "AND" },
          { type: "OPEN_PAREN" },
          { type: "STRING", value: "test" },
          { type: "OR" },
          { type: "STRING", value: "test" },
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
          { type: "STRING", value: "test" },
          { type: "AND" },
          { type: "OPEN_PAREN" },
          { type: "STRING", value: "test" },
          { type: "OR" },
          { type: "STRING", value: "test" },
          { type: "AND" },
          { type: "STRING", value: "test" },
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
