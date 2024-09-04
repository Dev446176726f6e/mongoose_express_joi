const { Mongoose, default: mongoose } = require("mongoose");
const { errorHandler } = require("../helpers/error_handler");
const Author = require("../schemas/Author");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authorValidation } = require("../validations/author.validation");
const config = require("config");
const myJwt = require("../services/jwt_service");
const { to } = require("../helpers/to_promise");

const uuid = require("uuid");
const mail_service = require("../services/mail_service");
const { badRequest } = require("../errors/api_error");

const addAuthor = async (req, res) => {
  try {
    const { error, value } = authorValidation(req.body);
    if (error) {
      console.log(error.details);
      return res.status(400).send({ message: error.message });
    }
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
    const activation_link = uuid.v4();

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
      activation_link,
    });
    // http://localhost:3000
    await mail_service.sendActivationMail(
      email,
      `${config.get("api_url")}:${config.get(
        "port"
      )}/api/author/activate/${activation_link}`
    );

    const payload = {
      _id: newAuthor._id,
      email: newAuthor.email,
    };

    const tokens = myJwt.generateTokens(payload);
    newAuthor.token = tokens.refreshToken;
    await newAuthor.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_time_ms"),
    });

    res.status(201).send({
      message: "New author created",
      id: newAuthor._id,
      accessToken: tokens.accessToken,
    });
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

    // throw badRequest("Authors is empty.!"); // hozir yaratilgan error pastdagi errorHandler tutib oladi.

    res.status(200).send(authors);
  } catch (error) {
    errorHandler(res, error);
    // istasak bu qismga next-ni qo'shib errorHandler o'rniga app.js da tutib olsak bo'ladi.
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

    if (authorID !== req.author._id) {
      return res.status(403).send({
        message:
          "Forbidden. You do not have permission to access this resource.",
      });
    }
    // console.log(foundAuthor);
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

    const validPassword = await bcrypt.compareSync(password, author.password);

    if (!validPassword) {
      return res.status(400).send({ message: "Invalid email or password" });
    }

    const payload = {
      _id: author._id,
      email: author.email,
      is_expert: author.is_expert,
      // author_roles: ["READ", "WRITE"],
    };

    // const token = jwt.sign(payload, config.get("tokeyKey"), {
    //   expiresIn: config.get("tokenTime"),
    // });

    const tokens = myJwt.generateTokens(payload);
    author.token = tokens.refreshToken;
    await author.save();

    // res.cookie("token", token, { httpOnly: true });
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_time_ms"),
    });

    res.send({
      message: "Author logged in",
      id: author._id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(res, error);
  }

  // try {
  //   setTimeout(function () {
  //     throw new Error("uncaughtException example");
  //   });
  // } catch (error) {
  //   console.log(error);
  // }

  // new Promise((_, reject) => {
  //   reject(new Error("unhandledRejection example"));
  // });
};

const logoutAuthor = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(403).send({ message: "RefreshToken not found" });
    }
    const author = await Author.findOneAndUpdate(
      { token: refreshToken },
      { token: "" },
      { new: true }
    );
    if (!author) {
      return res.status(400).send({ message: "Invalid refresh token" });
    }
    res.clearCookie("refreshToken");
    res.status(200).send({
      message: "Author logged out succesfully",
      refreshToken: author.token,
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
    const authorFromDB = await Author.findOne({ token: refreshToken });
    if (!authorFromDB) {
      return res
        .status(403)
        .send({ message: "Forbidden author(refreshToken does not match)" });
    }

    // shortening repetition part. DRY
    const payload = {
      _id: authorFromDB._id,
      email: authorFromDB.email,
    };

    const tokens = myJwt.generateTokens(payload);
    authorFromDB.token = tokens.refreshToken;
    await authorFromDB.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_time_as"),
    });

    res.status(201).send({
      message: "Token refreshed succesfully",
      id: authorFromDB._id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

// const authorActivate = async (req, res) => {
//   try {
//     const link = req.params.link;
//     const author = await Author.findOne({ activation_link: link });

//     if (!author) {
//       return res.status(400).send({ message: "Author not found" });
//     }

//     if (author.is_active) {
//       return res
//         .status(400)
//         .send({ message: "Author already activated his account" });
//     }
//     author.is_active = true;
//     await author.save();
//     res.send({
//       is_active: author.is_active,
//       message: "Author activated succesfully",
//     });
//   } catch (error) {
//     errorHandler(res, error);
//   }
// };

module.exports = {
  getAuthorByID,
  getAuthors,
  updateAuthor,
  deleteAuthor,
  addAuthor,
  loginAuthor,
  logoutAuthor,
  refreshToken,
  // authorActivate,
  refreshToken,
};
