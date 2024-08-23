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
    const newTerm = Dictionary.create({ term, letter: term[0] });
    res.status(201).send({ message: "New term created", newTerm });
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
  } catch (error) {}
};

const deleteTerm = async (req, res) => {
  try {
  } catch (error) {}
};

const updateTerm = async (req, res) => {
  try {
  } catch (error) {}
};

module.exports = {
  addTerm,
  getTerms,
};
