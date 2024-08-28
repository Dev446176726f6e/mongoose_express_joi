const { Mongoose, default: mongoose } = require("mongoose");
const { errorHandler } = require("../helpers/error_handler");
const Author = require("../schemas/Author");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");

const addAuthor = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      nick_name,
      email,
      phone,
      password,
      info,
      position,
      photo,
      is_expert,
      is_active,
    } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newAuthor = await Author.create({
      first_name,
      last_name,
      nick_name,
      email,
      phone,
      password: hashedPassword,
      info,
      position,
      photo,
      is_expert,
      is_active,
    });

    res.status(201).send({ message: "New author created", newAuthor });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAuthors = async (req, res) => {
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

    const authors = await Author.find();
    if (authors.length === 0) {
      return res.status(204).send({ message: "Authors is empty.!" });
    }
    res.status(200).send(authors);
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAuthorByID = async (req, res) => {
  try {
    const authorID = req.params.id;
    if (!mongoose.isValidObjectId(authorID)) {
      return res.status(400).send({ message: "Incorrect ObjectID" });
    }
    const foundAuthor = await Author.findById(authorID);
    if (!foundAuthor) {
      return res.status(404).send({ message: "Author not found" });
    }
    console.log(foundAuthor);
    res.status(200).send(foundAuthor);
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteAuthor = async (req, res) => {
  try {
    const { author_id } = req.body;
    if (!mongoose.isValidObjectId(author_id)) {
      return res.status(400).send({ message: "Incorrect ObjectID" });
    }
    const deletedAuthor = await Author.findByIdAndDelete(author_id);
    res
      .status(200)
      .send({ message: "Author deleted succesfully", deletedAuthor });
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateAuthor = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      nick_name,
      email,
      phone,
      password,
      info,
      position,
      photo,
      is_expert,
      is_active,
    } = req.body;
    const authorID = req.params.id;
    if (!mongoose.isValidObjectId(authorID)) {
      return res.status(400).send({ message: "Incorrect ObjectID" });
    }
    const hashedPassword = password ? bcrypt.hashSync(password, 10) : undefined;
    const updatedAuthor = await Author.findByIdAndUpdate(authorID, {
      first_name,
      last_name,
      nick_name,
      email,
      phone,
      password: hashedPassword,
      info,
      position,
      photo,
      is_expert,
      is_active,
    });
    if (!updatedAuthor) {
      return res.status(404).send({ message: "Author not found" });
    }
    console.log(updatedAuthor);
    res
      .status(200)
      .send({ message: "Author updated succesfully", updatedAuthor });
  } catch (error) {
    errorHandler(res, error);
  }
};

const loginAuthor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const author = await Author.findOne({ email });
    if (!author) {
      return res.status(404).send({ message: "Author not found" });
    }

    const payload = {
      _id: author._id,
      email: author.email,
    };

    const token = jwt.sign(payload, config.get("tokeyKey"), {
      expiresIn: config.get("tokenTime"),
    });

    res.cookie("token", token, { httpOnly: true });
    res.send({ message: "Author logged in", token });
  } catch (error) {
    errorHandler(res, error);
  }
};

const logoutAuthor = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).send({ message: "Author logged out succesfully" });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  getAuthorByID,
  getAuthors,
  updateAuthor,
  deleteAuthor,
  addAuthor,
  loginAuthor,
  logoutAuthor,
};
