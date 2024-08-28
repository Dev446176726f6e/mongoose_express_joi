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

const userPolice = require("../middleware/user_police");

const router = express.Router();

router.get("/", userPolice, getUsers);
router.post("/add", addUser);
router.delete("/delete", deleteUser);
router.put("/update/:id", updateUser);
router.get("/:id", getUserByID);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

module.exports = router;
