const config = require("config");
const express = require("express");
const morgan = require("morgan");
const router = require("./router");

const app = express();
app.use(morgan('dev'));
app.use(router);

const apiPort = config.get("apiPort");
app.listen(apiPort, () =>
  console.info(`Search Parser API :: Listening on port ${apiPort}`)
);

module.exports = app;
