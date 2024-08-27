const { Mongoose, default: mongoose } = require("mongoose");
const { errorHandler } = require("../helpers/error_handler");
const Topic = require("../schemas/Topic");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");

const addTopic = async (req, res) => {
  try {
    const {
      author_id,
      topic_title,
      topic_text,
      is_checked,
      is_approved,
      expert_id,
    } = req.body;
    const newTopic = await Topic.create({
      author_id,
      topic_title,
      topic_text,
      created_date: Date.now(),
      updated_date: null,
      is_checked,
      is_approved,
      expert_id,
    });

    res.status(201).send({ message: "New topic created", newTopic });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getTopics = async (req, res) => {
  try {
    const topics = (await Topic.find()).populate({
      path: "author_id",
      ref: "Author",
    });
    if (topics.length === 0) {
      return res.status(204).send({ message: "Topics is empty.!" });
    }
    res.status(200).send(topics);
  } catch (error) {
    errorHandler(res, error);
  }
};

const getTopicByID = async (req, res) => {
  try {
    const topicID = req.params.id;
    if (!mongoose.isValidObjectId(topicID)) {
      return res.status(400).send({ message: "Incorrect ObjectID" });
    }
    const foundTopic = await Topic.findById(topicID).populate({
      path: "author_id",
      ref: "Author",
    });
    if (!foundTopic) {
      return res.status(404).send({ message: "Topic not found" });
    }
    console.log(foundTopic);
    res.status(200).send(foundTopic);
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteTopic = async (req, res) => {
  try {
    const { topic_id } = req.body;
    if (!mongoose.isValidObjectId(topic_id)) {
      return res.status(400).send({ message: "Incorrect ObjectID" });
    }
    const deletedTopic = await Topic.findByIdAndDelete(topic_id);
    res
      .status(200)
      .send({ message: "Topic deleted succesfully", deletedTopic });
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateTopic = async (req, res) => {
  try {
    const {
      author_id,
      topic_title,
      topic_text,
      is_checked,
      is_approved,
      expert_id,
    } = req.body;
    const topicID = req.params.id;
    if (!mongoose.isValidObjectId(topicID)) {
      return res.status(400).send({ message: "Incorrect ObjectID" });
    }
    const updatedTopic = await Topic.findByIdAndUpdate(topicID, {
      author_id,
      topic_title,
      topic_text,
      updated_date: Date.now(),
      is_checked,
      is_approved,
      expert_id,
    });
    if (!updatedTopic) {
      return res.status(404).send({ message: "Topic not found" });
    }
    console.log(updatedTopic);
    res
      .status(200)
      .send({ message: "Topic updated succesfully", updatedTopic });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  getTopicByID,
  getTopics,
  addTopic,
  deleteTopic,
  updateTopic,
};
