const { Mongoose, default: mongoose } = require("mongoose");
const { errorHandler } = require("../helpers/error_handler");
const User = require("../schemas/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const myJwt = require("../services/jwt_service");
const { to } = require("../helpers/to_promise");
const { userValidation } = require("../validations/user.validation");

const addUser = async (req, res) => {
  try {
    const { error, value } = userValidation(req.body);
    if (error) {
      console.log(error.details);
      return res.status(400).send({ message: error.message });
    }
    const { name, email, password, info, photo, is_active } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      info,
      photo,
      created_date: Date(),
      updated_date: null,
    });

    const payload = {
      _id: newUser._id,
      email: newUser.email,
    };

    const tokens = myJwt.generateTokens(payload);
    newUser.token = tokens.refreshToken;
    await newUser.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_time_ms"),
    });

    // res.status(201).send({ message: "New user created", newUser });
    res.status(201).send({
      message: "New user created",
      id: newUser._id,
      accessToken: tokens.accessToken,
    });
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
      return res.status(404).send({
        message: "User not found",
      });
    }

    if (userID !== req.user._id) {
      return res.status(403).send({
        message:
          "Forbidden. You do not have permission to access this resource.",
      });
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
    const tokens = myJwt.generateTokens(payload);
    user.token = tokens.refreshToken;
    await user.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_time_ms"),
    });

    res.send({
      message: "User logged in",
      id: user._id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(403).send({ message: error.message });
    }
    const user = await User.findOneAndUpdate(
      { token: refreshToken },
      { token: "" },
      { new: true }
    );
    if (!user) {
      return res.status(400).send({ message: "Invalid refresh token" });
    }
    res.clearCookie("refreshToken");
    res.status(200).send({
      message: "User logged out succesfully",
      refreshToken: user.token,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(403).send({ message: "RefreshToken not found" });
    }
    const [error, decodedRefreshToken] = await to(
      myJwt.verifyRefreshToken(refreshToken)
    );
    if (error) {
      return res.status(403).send({ error: error.message });
    }
    const userFromDB = await User.findOne({ token: refreshToken });
    if (!userFromDB) {
      return res
        .status(403)
        .send({ message: "Forbidden user: refreshToken does not match" });
    }
    const payload = {
      _id: userFromDB._id,
      email: userFromDB.email,
    };

    const tokens = myJwt.generateTokens(payload);
    userFromDB.token = tokens.refreshToken;
    await userFromDB.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_time_ms"),
    });

    res.status(201).send({
      message: "Token refreshed succesfully",
      id: userFromDB._id,
      accessToken: tokens.accessToken,
    });
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
  refreshToken,
};
