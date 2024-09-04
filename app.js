const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const PORT = config.get("port") || 4005;
const mainRouter = require("./routes/index.routes");
const cookieParser = require("cookie-parser");
const exHbs = require("express-handlebars");
const viewRouter = require("./routes/view.routes");
// const winston = require("winston");
// const expressWinston = require("express-winston");
// const {
//   requestLogger,
//   errorLogger,
// } = require("./middleware/winston_error_handler");
const error_handling_middleware = require("./middleware/error_handling_middleware");

// require("dotenv").config({
//   path: `.env.${process.env.NODE_ENV}`,
// });
// console.log(process.env.NODE_ENV);
// console.log(process.env.secret);

// process.on("uncaughtException", (exception) => {
//   console.log("uncaughtException:", exception);
//   process.exit(1)
// });

// process.on("unhandledRejection", (rejection) => {
//   console.log("unhandledRejectioon:", rejection);

// })
const app = express();

app.use(express.json());
app.use(cookieParser());

const hbs = exHbs.create({
  defaultLayout: "main",
  extname: "hbs",
});
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");
app.use(express.static("views"));
// app.use(requestLogger);
app.use("/", viewRouter); // frontend
app.use("/api", mainRouter); // backend
app.use(error_handling_middleware); // error handling eng ohirida bo'lishi kerak.
// app.use(errorLogger);

async function start() {
  try {
    await mongoose.connect(config.get("dbUri"));
    app.listen(PORT, () => {
      console.log(`Server running at :${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server: ", error);
  }
}

start();
