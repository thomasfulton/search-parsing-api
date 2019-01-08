const chai = require("chai");

function get(path) {
  return chai.request(require("../../src/app")).get(path);
}

function post(path) {
  return chai.request(require("../../src/app")).post(path);
}

module.exports = { get, post };
