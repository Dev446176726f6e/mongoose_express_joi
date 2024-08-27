const { Mongoose, default: mongoose } = require("mongoose");
const { errorHandler } = require("../helpers/error_handler");
const Guest = require("../schemas/Guest");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");

const addGuest = async (req, res) => {
  try {
    const { id, os, device, browser, reg_date } = req.body;
    const newGuest = await Guest.create({
      id,
      os,
      device,
      browser,
      reg_date,
    });

    res.status(201).send({ message: "New guest created", newGuest });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getGuest = async (req, res) => {
  try {
    const guests = await Guest.find();
    if (guests.length === 0) {
      return res.status(204).send({ message: "Guest is empty.!" });
    }
    res.status(200).send(guests);
  } catch (error) {
    errorHandler(res, error);
  }
};

const getGuestByID = async (req, res) => {
  try {
    const guestID = req.params.id;
    if (!mongoose.isValidObjectId(guestID)) {
      return res.status(400).send({ message: "Incorrect ObjectID" });
    }
    const foundGuest = await Guest.findById(guestID);
    if (!foundGuest) {
      return res.status(404).send({ message: "Guest not found" });
    }
    console.log(foundGuest);
    res.status(200).send(foundGuest);
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteGuest = async (req, res) => {
  try {
    const { guest_id } = req.body;
    if (!mongoose.isValidObjectId(guest_id)) {
      return res.status(400).send({ message: "Incorrect ObjectID" });
    }
    const deletedGuest = await Guest.findByIdAndDelete(guest_id);
    res
      .status(200)
      .send({ message: "Guest deleted succesfully", deletedGuest });
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateGuest = async (req, res) => {
  try {
    const { id, os, device, browser, reg_date } = req.body;
    const guestID = req.params.id;
    if (!mongoose.isValidObjectId(guestID)) {
      return res.status(400).send({ message: "Incorrect ObjectID" });
    }
    const updatedGuest = await Guest.findByIdAndUpdate(guestID, {
      id,
      os,
      device,
      browser,
      reg_date,
    });
    if (!updatedGuest) {
      return res.status(404).send({ message: "Guest not found" });
    }
    console.log(updatedGuest);
    res
      .status(200)
      .send({ message: "Guest updated succesfully", updatedGuest });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  getGuest,
  getGuestByID,
  addGuest,
  deleteGuest,
  updateGuest,
};
