const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const PORT = config.get("port") || 4005;
const mainRouter = require("./routes/index.routes");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api", mainRouter);

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
