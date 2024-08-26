const mongoose = require("mongoose");
const { errorHandler } = require("../helpers/error_handler");
const Description = require("../schemas/Description");

const addDesc = async (req, res) => {
  try {
    const { category_id, description } = req.body;
    //  if (category) {
    //    return res
    //      .status(400)
    //      .send({ message: "This category already has description exists.!" });
    //  }
    //  do i need to check whether category id exists in category collection.
    const newDesc = await Description.create({
      category_id: category_id || null,
      description,
    });
    // console.log(newDesc);
    res.status(201).send({ message: "New description created" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getDescs = async (req, res) => {
  try {
    const descriptions = await Description.find().populate({
      path: "category_id",
      select: "category_name -_id",
    });
    if (descriptions.length === 0) {
      return res.status(204).send({ message: "Descriptions is empty.!" });
    }
    //  console.log(categories);
    res.status(200).send(descriptions);
  } catch (error) {
    errorHandler(res, error);
  }
};

const getDescriptionByID = async (req, res) => {
  try {
    const descID = req.params.id;
    if (!mongoose.isValidObjectId(descID)) {
      return res.status(400).send({ message: "Incorrect ObjectID" });
    }
    const foundDesc = await Description.findById(descID).populate({
      path: "category_id",
      select: "category_name -_id",
    }); // add populate
    if (!foundDesc) {
      return res.status(404).send({ message: "Description not found" });
    }
    console.log(foundDesc);
    res.status(200).send(foundDesc);
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteDesc = async (req, res) => {
  try {
    const { desc_id } = req.body;
    if (!mongoose.isValidObjectId(desc_id)) {
      return res.status(400).send({ message: "Incorrect ObjectID" });
    }
    const deletedDesc = await Description.findByIdAndDelete(desc_id);
    res
      .status(200)
      .send({ message: "Description deleted succesfully", deletedDesc });
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateDesc = async (req, res) => {
  try {
    const { category_id, description } = req.body;
    const descID = req.params.id;

    if (!mongoose.isValidObjectId(descID)) {
      return res.status(400).send({ message: "Incorrect ObjectID" });
    }

    const existingDesc = await Description.findById(descID);
    if (!existingDesc) {
      return res.status(404).send({ message: "Description not found." });
    }

    const updateFields = {
      category_id:
        category_id && mongoose.isValidObjectId(category_id)
          ? category_id
          : existingDesc.category_id,
      description: description || existingDesc.description,
    };

    const updatedDesc = await Description.findByIdAndUpdate(
      descID,
      updateFields,
      { new: true }
    );

    res
      .status(200)
      .send({ message: "Category updated successfully", updatedDesc });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  getDescriptionByID,
  getDescs,
  addDesc,
  updateDesc,
  deleteDesc,
};
