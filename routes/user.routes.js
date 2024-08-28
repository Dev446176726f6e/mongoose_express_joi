const express = require("express");
const {
  getUsers,
  addUser,
  deleteUser,
  updateUser,
  getUserByID,
  loginUser,
  logoutUser,
} = require("../controllers/user");

const router = express.Router();

router.get("/", getUsers);
router.post("/add", addUser);
router.delete("/delete", deleteUser);
router.put("/update/:id", updateUser);
router.get("/:id", getUserByID);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

module.exports = router;
