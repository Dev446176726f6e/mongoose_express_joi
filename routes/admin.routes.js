const express = require("express");
const {
  getAdmins,
  addAdmin,
  deleteAdmin,
  updateAdmin,
  getAdminByID,
  loginAdmin,
  logoutAdmin,
} = require("../controllers/admin");

const adminPolice = require("../middleware/admin_police");

const router = express.Router();

router.get("/", adminPolice, getAdmins);
router.post("/add", addAdmin);
router.delete("/delete", deleteAdmin);
router.put("/update/:id", updateAdmin);
router.get("/:id", getAdminByID);
router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);

module.exports = router;
