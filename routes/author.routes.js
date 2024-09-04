const express = require("express");
const {
  getAuthors,
  addAuthor,
  deleteAuthor,
  updateAuthor,
  getAuthorByID,
  loginAuthor,
  logoutAuthor,
  refreshToken,
  // authorActivate,
} = require("../controllers/author");

const authorPolice = require("../middleware/author_police");
// const authorRolesPolice = require("../middleware/author_roles_police");
// rollarni tekshirib huquq berish uchun middlware

const router = express.Router();

// "middleware", o'rtada qanday vazifa berilgan bo'lsa (xoh u tekshirish yoki boshqa vazifa bo'lsin)
// uni bajarib, next() orqali keyingi vazifasiga jo'natadi.
router.get("/", authorPolice, getAuthors);
// hozir, hamma uchun umumiy bitta access va refresh token yaratilgan.
// lekin, bir nechta admin uchun alohida, user uchun alohida yaratish mumkin.
// router.get("/activate/:link", authorActivate);
router.post("/add", addAuthor);
router.delete("/delete", deleteAuthor);
router.put("/update/:id", updateAuthor);
router.get("/:id", authorPolice, getAuthorByID);
router.post("/login", loginAuthor);
router.post("/logout", logoutAuthor);
router.post("/refresh", refreshToken);

module.exports = router;
