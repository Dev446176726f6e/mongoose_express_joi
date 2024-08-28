const { Mongoose, default: mongoose } = require("mongoose");
const { errorHandler } = require("../helpers/error_handler");
const User = require("../schemas/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");

const addUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      info,
      photo,
      created_date,
      updated_date,
      is_active,
    } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      info,
      photo,
      created_date,
      updated_date,
      is_active,
    });

    res.status(201).send({ message: "New user created", newUser });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      return res.status(204).send({ message: "Users is empty.!" });
    }
    res.status(200).send(users);
  } catch (error) {
    errorHandler(res, error);
  }
};

const getUserByID = async (req, res) => {
  try {
    const userID = req.params.id;
    if (!mongoose.isValidObjectId(userID)) {
      return res.status(400).send({ message: "Incorrect ObjectID" });
    }
    const foundUser = await User.findById(userID);
    if (!foundUser) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send(foundUser);
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { user_id } = req.body;
    if (!mongoose.isValidObjectId(user_id)) {
      return res.status(400).send({ message: "Incorrect ObjectID" });
    }
    const deletedUser = await User.findByIdAndDelete(user_id);
    res.status(200).send({ message: "User deleted successfully", deletedUser });
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, password, info, photo, is_active } = req.body;
    const userID = req.params.id;
    if (!mongoose.isValidObjectId(userID)) {
      return res.status(400).send({ message: "Incorrect ObjectID" });
    }
    const hashedPassword = password ? bcrypt.hashSync(password, 10) : undefined;
    const updatedUser = await User.findByIdAndUpdate(
      userID,
      {
        name,
        email,
        password: hashedPassword,
        info,
        photo,
        updated_date: Date.now(),
        is_active,
      },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send({ message: "User updated successfully", updatedUser });
  } catch (error) {
    errorHandler(res, error);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send({ message: "Invalid email or password" });
    }

    const payload = {
      _id: user._id,
      email: user.email,
    };
    const token = jwt.sign(payload, config.get("tokenKey"), {
      expiresIn: config.get("tokenTime"),
    });

    res.cookie("token", token, { httpOnly: true });
    res.send({ message: "User logged in", token });
  } catch (error) {
    errorHandler(res, error);
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).send({ message: "User logged out successfully" });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  getUserByID,
  getUsers,
  addUser,
  deleteUser,
  updateUser,
  loginUser,
  logoutUser,
};
