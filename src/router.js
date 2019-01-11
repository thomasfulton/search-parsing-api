const express = require("express");
const parseController = require("./controller/parse");

const router = express.Router();

router.post("/parse", parseController.post);

module.exports = router;
