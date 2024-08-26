const express = require("express");
const {
  getDescs,
  addDesc,
  deleteDesc,
  updateDesc,
  getDescriptionByID,
} = require("../controllers/description");

const router = express.Router();

router.get("/", getDescs);
router.post("/add", addDesc);
router.delete("/delete", deleteDesc);
router.put("/update/:id", updateDesc);
router.get("/:id", getDescriptionByID);

module.exports = router;
