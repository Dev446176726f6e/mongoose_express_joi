const mongoose = require("mongoose");
const { errorHandler } = require("../helpers/error_handler");
const Synonym = require("../schemas/Synonym");

const addSynonym = async (req, res) => {
  try {
    const { desc_id, dict_id } = req.body;
    //  do i need to check whether category id exists in category collection.
    const newSynonym = await Synonym.create({
      desc_id,
      dict_id,
    });
    res.status(201).send({ message: "New synonym created" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getSynonyms = async (req, res) => {
  try {
    const synonyms = await Synonym.find()
      .populate({ path: "desc_id" })
      .populate({ path: "dict_id" });
    if (synonyms.length === 0) {
      return res.status(204).send({ message: "Synonyms is empty.!" });
    }
    res.status(200).send(synonyms);
  } catch (error) {
    errorHandler(res, error);
  }
};

const getSynonymByID = async (req, res) => {
  try {
    const synonymID = req.params.id;
    if (!mongoose.isValidObjectId(synonymID)) {
      return res.status(400).send({ message: "Incorrect ObjectID" });
    }
    const foundSynonym = await Synonym.findById(synonymID)
      .populate({ path: "desc_id" })
      .populate({ path: "dict_id" });
    if (!foundSynonym) {
      return res.status(404).send({ message: "Synonym not found" });
    }
    console.log(foundSynonym);
    res.status(200).send(foundSynonym);
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteSynonym = async (req, res) => {
  try {
    const { synonym_id } = req.body;
    if (!mongoose.isValidObjectId(synonym_id)) {
      return res.status(400).send({ message: "Incorrect ObjectID" });
    }
    const deletedSynonym = await Synonym.findByIdAndDelete(synonym_id);
    res
      .status(200)
      .send({ message: "Synonym deleted succesfully", deletedSynonym });
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateSynonym = async (req, res) => {
  try {
    const { desc_id, dict_id } = req.body;
    const synonymID = req.params.id;

    if (!mongoose.isValidObjectId(synonymID)) {
      return res.status(400).send({ message: "Incorrect ObjectID" });
    }

    const existingSynonym = await Synonym.findById(synonymID);
    if (!existingSynonym) {
      return res.status(404).send({ message: "Synonym not found." });
    }

    const updateFields = {
      desc_id:
        desc_id && mongoose.isValidObjectId(desc_id)
          ? desc_id
          : existingSynonym.desc_id,
      dict_id:
        dict_id && mongoose.isValidObjectId(dict_id)
          ? dict_id
          : existingSynonym.dict_id,
    };

    const updatedSynonym = await Synonym.findByIdAndUpdate(
      synonymID,
      updateFields,
      { new: true }
    );

    res
      .status(200)
      .send({ message: "Synonym updated successfully", updatedSynonym });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  getSynonymByID,
  getSynonyms,
  addSynonym,
  updateSynonym,
  deleteSynonym,
};
