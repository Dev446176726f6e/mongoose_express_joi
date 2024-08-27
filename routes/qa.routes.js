const express = require("express");
const {
  getQa,
  addQa,
  deleteQa,
  updateQa,
  getQaByID,
} = require("../controllers/question_answer");

const router = express.Router();

router.get("/", getQa);
router.post("/add", addQa);
router.delete("/delete", deleteQa);
router.put("/update/:id", updateQa);
router.get("/:id", getQaByID);

module.exports = router;
