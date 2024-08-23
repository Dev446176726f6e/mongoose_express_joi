const express = require("express");
const DictRouter = require("./dictionary.routes");
const { model } = require("mongoose");

const router = express.Router();

router.use("/dict", DictRouter);

module.exports = router;
