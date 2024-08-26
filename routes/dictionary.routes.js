const express = require("express");
const {
  addTerm,
  getTerms,
  getTermByID,
  deleteTerm,
  updateTerm,
} = require("../controllers/dictionary");

const router = express.Router();

router.post("/create", addTerm);
router.get("/terms", getTerms);
router.delete("/delete", deleteTerm);
router.get("/term/:id", getTermByID);
router.put("/update/:id", updateTerm);

module.exports = router;
