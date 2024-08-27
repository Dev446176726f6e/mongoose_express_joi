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
    //  const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = await User.create({
      name,
      email,
      password,
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
    //  const authorization = req.headers.authorization;
    //  if (!authorization) {
    // return res.status(403).send({ message: "Token is not provided" });
    //  }
    //  console.log(authorization);
    //  const bearer = authorization.split(" ")[0];
    //  const token = authorization.split(" ")[1];

    //  if (bearer != "Bearer" || !token) {
    // return res.status(403).send({ message: "Wrong token" });
    //  }
    //  const decodedToken = jwt.decode(token, config.get("tokenKey"));
    //  console.log(decodedToken);

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
    console.log(foundUser);
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
    res.status(200).send({ message: "User deleted succesfully", deletedUser });
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateUser = async (req, res) => {
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
    const userID = req.params.id;
    if (!mongoose.isValidObjectId(userID)) {
      return res.status(400).send({ message: "Incorrect ObjectID" });
    }
    const updatedUser = await User.findByIdAndUpdate(userID, {
      name,
      email,
      password,
      info,
      photo,
      created_date,
      updated_date,
      is_active,
    });
    if (!updatedUser) {
      return res.status(404).send({ message: "User not found" });
    }
    console.log(updatedUser);
    res.status(200).send({ message: "User updated succesfully", updatedUser });
  } catch (error) {
    errorHandler(res, error);
  }
};

// const loginAdmin = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const admin = await Admin.findOne({ email });
//     if (!admin) {
//       return res.status(404).send({ message: "Admin not found" });
//     }
//     const validPassword = await bcrypt.compareSync(password, admin.password);

//     if (!validPassword) {
//       return res.status(400).send({ message: "Invalid email or password" });
//     }

//     const payload = {
//       _id: admin._id,
//       email: admin.email,
//     };
//     const token = jwt.sign(payload, config.get("tokenKey"), {
//       expiresIn: config.get("tokenTime"),
//     });
//     res.send({ message: "Admin logged in", token });
//   } catch (error) {
//     errorHandler(res, error);
//   }
// };

// const logoutAdmin = async (req, res) => {
//   try {
//     const adminId = req.params.id;
//     res.clearCookie("token");
//   } catch (error) {
//     errorHandler(res, error);
//   }
// };

module.exports = {
  getUserByID,
  getUsers,
  addUser,
  deleteUser,
  updateUser,
};
