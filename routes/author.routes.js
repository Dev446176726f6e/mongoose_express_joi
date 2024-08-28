const express = require("express");
const {
  getAuthors,
  addAuthor,
  deleteAuthor,
  updateAuthor,
  getAuthorByID,
  loginAuthor,
  logoutAuthor,
} = require("../controllers/author");

const router = express.Router();

router.get("/", getAuthors);
router.post("/add", addAuthor);
router.delete("/delete", deleteAuthor);
router.put("/update/:id", updateAuthor);
router.get("/:id", getAuthorByID);
router.post("/login", loginAuthor);
router.post("/logout", logoutAuthor);

module.exports = router;
