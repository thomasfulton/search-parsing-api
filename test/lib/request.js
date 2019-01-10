const chai = require("chai");

function get(path) {
  return chai.request(require("../../src/app")).get(path);
}

function post(path, body) {
  return chai.request(require("../../src/app")).post(path).send(body);
}

module.exports = { get, post };
