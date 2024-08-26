const express = require("express");
const DictRouter = require("./dictionary.routes");
const CategoryRouter = require("./category.routes");
const DescriptionRouter = require("./description.routes");
const SynonymRouter = require("./synonym.routes");
const AdminRouter = require("./admin.routes");
// user
// author

const router = express.Router();

router.use("/dict", DictRouter);
router.use("/cat", CategoryRouter);
router.use("/desc", DescriptionRouter);
router.use("/syn", SynonymRouter);
router.use("/admin", AdminRouter);
// user
// author

module.exports = router;
