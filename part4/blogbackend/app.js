const express = require("express");
const mongoose = require("mongoose");
const config = require("./utils/config");
const logger = require("./utils/logger");
const blogsRouter = require("./controllers/blog");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const { errorHandler } = require("./utils/middleware");

const app = express();

const mongoUrl = config.MONGODB_URI;

logger.info("connecting to", mongoUrl);
mongoose
  .connect(mongoUrl)
  .then(() => {
    logger.info("connected to database");
  })
  .catch(() => {
    logger.error("error connection to MongoDB:", error.message);
  });

app.use(express.json());

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

app.use(errorHandler);

module.exports = app;
