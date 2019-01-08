const { expect } = require("chai");
const { post } = require("../lib/request");

describe("parse controller", () => {
  it("works", () => {
    return post('/parse').then(response => {
      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal({});
    });
  });
});
