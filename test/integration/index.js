const { expect } = require("chai");
const { post } = require("../lib/request");
const { input, responseBody } = require("./fixtures");

describe("parse controller", () => {
  it("parses valid input", () => {
    return post("/parse", { input }).then(response => {
      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(responseBody);
    });
  });
  it("returns error on invalid input", () => {
    return post("/parse", { input: "(test" }).then(response => {
      expect(response.status).to.equal(400);
      expect(response.body).to.deep.equal({ error: "BRACKET_MISMATCH" });
    });
  });
});
