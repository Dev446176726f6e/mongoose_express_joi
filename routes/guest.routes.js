const express = require("express");
const {
  addGuest,
  getGuest,
  deleteGuest,
  updateGuest,
  getGuestByID,
} = require("../controllers/guest");

const router = express.Router();

router.get("/", getGuest);
router.post("/add", addGuest);
router.delete("/delete", deleteGuest);
router.put("/update/:id", updateGuest);
router.get("/:id", getGuestByID);

module.exports = router;
