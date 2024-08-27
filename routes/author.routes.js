const express = require("express");
const {
  getAuthors,
  addAuthor,
  deleteAuthor,
  updateAuthor,
  getAuthorByID,
} = require("../controllers/author");

const router = express.Router();

router.get("/", getAuthors);
router.post("/add", addAuthor);
router.delete("/delete", deleteAuthor);
router.put("/update/:id", updateAuthor);
router.get("/:id", getAuthorByID);

module.exports = router;
