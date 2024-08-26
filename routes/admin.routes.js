const express = require("express");
const {
  getAdmins,
  addAdmin,
  deleteAdmin,
  updateAdmin,
  getAdminByID,
  login,
} = require("../controllers/admin");

const router = express.Router();

router.get("/", getAdmins);
router.post("/add", addAdmin);
router.delete("/delete", deleteAdmin);
router.put("/update/:id", updateAdmin);
router.get("/:id", getAdminByID);
router.post("/login", login);


module.exports = router;
