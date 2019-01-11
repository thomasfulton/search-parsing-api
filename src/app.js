const config = require("config");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const router = require("./router");

const app = express();
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(router);

const apiPort = config.get("apiPort");
const server = app.listen(apiPort, () =>
  console.info(`Search Parser API :: Listening on port ${apiPort}.`)
);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "INTERNAL_SERVER_ERROR" });
});

// `docker stop` sends a sigterm, this is needed for the application to exit
// gracefully.
process.on("SIGTERM", () => {
  console.info("SIGTERM received; shutting down.");
  server.close();
});

module.exports = app;
