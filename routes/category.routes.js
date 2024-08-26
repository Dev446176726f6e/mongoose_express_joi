const express = require("express");
const {
  getCategoryByID,
  updateCategory,
  deleteCategory,
  addCategory,
  getCategories,
} = require("../controllers/category");

const router = express.Router();

router.get("/categories", getCategories);
router.post("/category/add", addCategory);
router.delete("/category/delete", deleteCategory);
router.put("/category/update/:id", updateCategory);
router.get("/category/:id", getCategoryByID);

module.exports = router;
