const mongoose = require("mongoose");
const { errorHandler } = require("../helpers/error_handler");
const Category = require("../schemas/Category");

const addCategory = async (req, res) => {
  try {
    const { category_name, parent_category_id } = req.body;
    const category = await Category.findOne({
      category_name: new RegExp(category_name, "i"), // Correct way to use regex with options
    });
    if (category) {
      return res
        .status(400)
        .send({ message: "This category already exists.!" });
    }
    const newCategory = await Category.create({
      category_name,
      parent_category_id: parent_category_id || null,
    });
    // console.log(newTerm);
    res.status(201).send({ message: "New category created" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate({
      path: "parent_category_id",
      select: "category_name",
    }); //add populate
    if (categories.length === 0) {
      return res.status(204).send({ message: "Categories is empty.!" });
    }
    //  console.log(categories);
    res.status(200).send(categories);
  } catch (error) {
    errorHandler(res, error);
  }
};

const getCategoryByID = async (req, res) => {
  try {
    const categoryID = req.params.id;
    if (!mongoose.isValidObjectId(categoryID)) {
      return res.status(400).send({ message: "Incorrect ObjectID" });
    }
    const foundCategory = await Category.findById(categoryID).populate({
      path: "parent_category_id",
      select: "category_name -_id",
    }); // add populate
    if (!foundCategory) {
      return res.status(404).send({ message: "Category not found" });
    }
    console.log(foundCategory);
    res.status(200).send(foundCategory);
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { category_id } = req.body;
    if (!mongoose.isValidObjectId(category_id)) {
      return res.status(400).send({ message: "Incorrect ObjectID" });
    }
    const deletedCategory = await Category.findByIdAndDelete(category_id);
    res
      .status(200)
      .send({ message: "Category deleted succesfully", deletedCategory });
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateCategory = async (req, res) => {
  try {
    const { category_name, parent_category_id } = req.body;
    const categoryID = req.params.id;

    if (!mongoose.isValidObjectId(categoryID)) {
      return res.status(400).send({ message: "Incorrect ObjectID" });
    }

    const existingCategory = await Category.findById(categoryID);
    if (!existingCategory) {
      return res.status(404).send({ message: "Category not found." });
    }

    const updateFields = {
      category_name: category_name || existingCategory.category_name,
      parent_category_id:
        parent_category_id && mongoose.isValidObjectId(parent_category_id)
          ? parent_category_id
          : existingCategory.parent_category_id,
    };

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryID,
      updateFields,
      { new: true }
    );

    res
      .status(200)
      .send({ message: "Category updated successfully", updatedCategory });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  getCategoryByID,
  getCategories,
  addCategory,
  deleteCategory,
  updateCategory,
};
