const { Mongoose, default: mongoose } = require("mongoose");
const { errorHandler } = require("../helpers/error_handler");
const Dictionary = require("../schemas/Dictionary");

const addTerm = async (req, res) => {
  try {
    const { term } = req.body;
    const dict = Dictionary.findOne({
      term: { $regex: term, options: "i" },
    });
    if (dict) {
      return res.status(400).send({ message: "This term exists.!" });
    }
    const newTerm = await Dictionary.create({ term, letter: term[0] });
    // console.log(newTerm);
    res.status(201).send({ message: "New term created" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getTerms = async (req, res) => {
  try {
    const terms = await Dictionary.find();
    if (terms.length === 0) {
      return res.status(204).send({ message: "Dictionary is empty.!" });
    }
    //  console.log(terms);
    res.status(200).send(terms);
  } catch (error) {
    errorHandler(res, error);
  }
};

const getTermByID = async (req, res) => {
  try {
    const termID = req.params.id;
    if (!mongoose.isValidObjectId(termID)) {
      return res.status(400).send({ message: "Incorrect ObjectID" });
    }
    const foundTerm = await Dictionary.findById(termID);
    if (!foundTerm) {
      return res.status(404).send({ message: "Term not found" });
    }
    console.log(foundTerm);
    res.status(200).send(foundTerm);
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteTerm = async (req, res) => {
  try {
    const { termID } = req.body;
    if (!mongoose.isValidObjectId(termID)) {
      return res.status(400).send({ message: "Incorrect ObjectID" });
    }
    const deletedTerm = await Dictionary.findByIdAndDelete(termID);
    res.status(200).send({ message: "Term deleted succesfully", deletedTerm });
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateTerm = async (req, res) => {
  try {
    const { term } = req.body;
    const termID = req.params.id;
    if (!mongoose.isValidObjectId(termID)) {
      return res.status(400).send({ message: "Incorrect ObjectID" });
    }
    const updatedTerm = await Dictionary.findByIdAndUpdate(termID, {
      term,
      letter: term[0],
    });
    if (!updatedTerm) {
      return res.status(404).send({ message: "Term not found" });
    }
    console.log(updatedTerm);
    res.status(200).send({ message: "Term updated succesfully", updatedTerm });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  addTerm,
  getTerms,
  updateTerm,
  getTermByID,
  deleteTerm,
};
