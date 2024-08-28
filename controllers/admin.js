const { Mongoose, default: mongoose } = require("mongoose");
const { errorHandler } = require("../helpers/error_handler");
const Admin = require("../schemas/Admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const myJwt = require("../services/jwt_service");

const addAdmin = async (req, res) => {
  try {
    const { name, email, phone, password, is_active, is_creator } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newAdmin = await Admin.create({
      name,
      email,
      phone,
      password: hashedPassword,
      is_active,
      is_creator,
      created_date: Date(),
      updated_date: null,
    });

    const payload = {
      _id: newAdmin._id,
      email: newAdmin.email,
    };
    const tokens = myJwt.generateTokens(payload);
    newAdmin.token = tokens.refreshToken;
    await newAdmin.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_time_ms"),
    });

    res.status(201).send({
      message: "New admin created",
      id: newAdmin._id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    if (admins.length === 0) {
      return res.status(204).send({ message: "Admins is empty.!" });
    }
    res.status(200).send(admins);
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAdminByID = async (req, res) => {
  try {
    const adminID = req.params.id;
    if (!mongoose.isValidObjectId(adminID)) {
      return res.status(400).send({ message: "Incorrect ObjectID" });
    }
    const foundAdmin = await Admin.findById(adminID);
    if (!foundAdmin) {
      return res.status(404).send({ message: "Admin not found" });
    }
    console.log(foundAdmin);
    res.status(200).send(foundAdmin);
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const { admin_id } = req.body;
    if (!mongoose.isValidObjectId(admin_id)) {
      return res.status(400).send({ message: "Incorrect ObjectID" });
    }
    const deletedAdmin = await Admin.findByIdAndDelete(admin_id);
    res
      .status(200)
      .send({ message: "Admin deleted succesfully", deletedAdmin });
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateAdmin = async (req, res) => {
  try {
    const { name, email, phone, password, is_active, is_creator } = req.body;
    const adminID = req.params.id;
    if (!mongoose.isValidObjectId(adminID)) {
      return res.status(400).send({ message: "Incorrect ObjectID" });
    }
    const updatedAdmin = await Admin.findByIdAndUpdate(adminID, {
      name,
      email,
      phone,
      password,
      is_active,
      is_creator,
      updated_date: Date.now(),
    });
    if (!updatedAdmin) {
      return res.status(404).send({ message: "Admin not found" });
    }
    console.log(updatedAdmin);
    res
      .status(200)
      .send({ message: "Admin updated succesfully", updatedAdmin });
  } catch (error) {
    errorHandler(res, error);
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).send({ message: "Admin not found" });
    }
    const validPassword = await bcrypt.compareSync(password, admin.password);

    if (!validPassword) {
      return res.status(400).send({ message: "Invalid email or password" });
    }

    const payload = {
      _id: admin._id,
      email: admin.email,
    };
    // const token = jwt.sign(payload, config.get("tokenKey"), {
    //   expiresIn: config.get("tokenTime"),
    // });
    const tokens = myJwt.generateTokens(payload);
    admin.token = tokens.refreshToken;
    await admin.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_time_ms"),
    });
    // res.cookie("tokens", tokens, { httpOnly: true });
    // console.log(res.getHeaders());
    res.send({
      message: "Admin logged in",
      id: admin._id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const logoutAdmin = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(403).send({ message: error.message });
    }
    // res.clearCookie("token");
    const admin = await Admin.findOneAndUpdate(
      { token: refreshToken },
      { token: "" },
      { new: true }
    );
    if (!admin) {
      return res.status(400).send({ message: "Invalid refresh token" });
    }
    res.clearCookie("refreshToken");
    // res.status(200).send({ message: "Admin logged out successfully" });
    res.send({ refreshToken: admin.token });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  getAdminByID,
  getAdmins,
  updateAdmin,
  deleteAdmin,
  addAdmin,
  logoutAdmin,
  loginAdmin,
};
