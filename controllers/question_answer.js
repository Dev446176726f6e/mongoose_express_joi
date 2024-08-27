const { Mongoose, default: mongoose } = require("mongoose");
const { errorHandler } = require("../helpers/error_handler");
const Q_a = require("../schemas/Question_Answer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");

const addQa = async (req, res) => {
  try {
    const { question, answer, is_checked, user_id, expert_id } = req.body;
    const newQa = await Q_a.create({
      question,
      answer,
      created_date: Date.now(),
      updated_date: null,
      is_checked,
      user_id,
      expert_id,
    });

    res.status(201).send({ message: "New Qa created", newQa });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getQa = async (req, res) => {
  try {
    const qaS = (await Q_a.find())
      .populate({
        path: "user_id",
        ref: "User",
      })
      .populate({
        path: "expert_id",
        ref: "Author",
      });
    if (qaS.length === 0) {
      return res.status(204).send({ message: "QaS is empty.!" });
    }
    res.status(200).send(qaS);
  } catch (error) {
    errorHandler(res, error);
  }
};

const getQaByID = async (req, res) => {
  try {
    const qaID = req.params.id;
    if (!mongoose.isValidObjectId(qaID)) {
      return res.status(400).send({ message: "Incorrect ObjectID" });
    }
    const foundQa = await Q_a.findById(qaID)
      .populate({
        path: "user_id",
        ref: "User",
      })
      .populate({
        path: "expert_id",
        ref: "Author",
      });
    if (!foundQa) {
      return res.status(404).send({ message: "Qa not found" });
    }
    console.log(foundQa);
    res.status(200).send(foundQa);
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteQa = async (req, res) => {
  try {
    const { qa_id } = req.body;
    if (!mongoose.isValidObjectId(qa_id)) {
      return res.status(400).send({ message: "Incorrect ObjectID" });
    }
    const deletedQa = await Q_a.findByIdAndDelete(qa_id);
    res.status(200).send({ message: "Qa deleted succesfully", deletedQa });
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateQa = async (req, res) => {
  try {
    const { question, answer, is_checked, user_id, expert_id } = req.body;
    const qaID = req.params.id;
    if (!mongoose.isValidObjectId(qaID)) {
      return res.status(400).send({ message: "Incorrect ObjectID" });
    }
    const updatedQa = await Q_a.findByIdAndUpdate(qaID, {
      question,
      answer,
      updated_date: Date.now(),
      is_checked,
      user_id,
      expert_id,
    });
    if (!updatedQa) {
      return res.status(404).send({ message: "Qa not found" });
    }
    console.log(updatedQa);
    res.status(200).send({ message: "Qa updated succesfully", updatedQa });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  getQa,
  getQaByID,
  addQa,
  updateQa,
  deleteQa,
};
