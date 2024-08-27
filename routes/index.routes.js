const express = require("express");
const DictRouter = require("./dictionary.routes");
const CategoryRouter = require("./category.routes");
const DescriptionRouter = require("./description.routes");
const SynonymRouter = require("./synonym.routes");
const AdminRouter = require("./admin.routes");
const UserRouter = require("./user.routes");
const AuthorRouter = require("./author.routes");
const QaRouter = require("./qa.routes");
const TopicRouter = require("./topic.routes");
const GuestRouter = require("./guest.routes");

const router = express.Router();

router.use("/dict", DictRouter);
router.use("/cat", CategoryRouter);
router.use("/desc", DescriptionRouter);
router.use("/syn", SynonymRouter);
router.use("/admin", AdminRouter);
router.use("/user", UserRouter);
router.use("/author", AuthorRouter);
router.use("/qA", QaRouter);
router.use("/topic", TopicRouter);
router.use("/guest", GuestRouter);

module.exports = router;
