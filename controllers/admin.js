const { Mongoose, default: mongoose } = require("mongoose");
const { errorHandler } = require("../helpers/error_handler");
const Admin = require("../schemas/Admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");

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
      created_date: Date.now(),
      updated_date: null,
    });

    res.status(201).send({ message: "New admin created" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAdmins = async (req, res) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(403).send({ message: "Token is not provided" });
    }
    console.log(authorization);
    const bearer = authorization.split(" ")[0];
    const token = authorization.split(" ")[1];

    if (bearer != "Bearer" || !token) {
      return res.status(403).send({ message: "Wrong token" });
    }
    const decodedToken = jwt.decode(token, config.get("tokenKey"));
    console.log(decodedToken);

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
    const token = jwt.sign(payload, config.get("tokenKey"), {
      expiresIn: config.get("tokenTime"),
    });
    res.send({ message: "Admin logged in", token });
  } catch (error) {
    errorHandler(res, error);
  }
};

const logoutAdmin = async (req, res) => {
  try {
    const adminId = req.params.id;
    res.clearCookie("token");
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
