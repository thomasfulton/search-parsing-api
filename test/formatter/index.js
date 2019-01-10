const { format } = require("../../src/formatter");
const { expect } = require("chai");
const { input, output } = require("./fixtures");

describe("formatter", () => {
  describe("format()", () => {
    it("formats parser output correctly", () => {
      expect(format(input)).to.deep.equal(output);
    });
  });
});
