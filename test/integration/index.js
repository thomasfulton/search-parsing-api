const { expect } = require("chai");
const { post } = require("../lib/request");
const { input, responseBody } = require("./fixtures");

describe("parse controller", () => {
  it("works", () => {
    return post("/parse", { input }).then(response => {
      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(responseBody);
    });
  });
});
