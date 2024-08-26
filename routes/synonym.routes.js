const express = require("express");
const {
  getSynonyms,
  addSynonym,
  deleteSynonym,
  updateSynonym,
  getSynonymByID,
} = require("../controllers/synonym");

const router = express.Router();

router.get("/", getSynonyms);
router.post("/add", addSynonym);
router.delete("/delete", deleteSynonym);
router.put("/update/:id", updateSynonym);
router.get("/:id", getSynonymByID);


module.exports = router;
