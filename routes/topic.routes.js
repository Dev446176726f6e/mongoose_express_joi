const express = require("express");
const {
  getTopics,
  addTopic,
  deleteTopic,
  updateTopic,
  getTopicByID,
} = require("../controllers/topic");

const router = express.Router();

router.get("/", getTopics);
router.post("/add", addTopic);
router.delete("/delete", deleteTopic);
router.put("/update/:id", updateTopic);
router.get("/:id", getTopicByID);

module.exports = router;
