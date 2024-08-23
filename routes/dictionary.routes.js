const express = require("express");
const { addTerm, getTerms } = require("../controllers/dictionary");

const router = express.Router();

router.post("/create", addTerm);
router.get("/", getTerms);

module.exports = router;
