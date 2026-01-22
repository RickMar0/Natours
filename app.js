// require modules
const express = require("express");
const morgan = require("morgan");
const app = express();
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

// 1) MIDDLEWARE
app.use(morgan("dev")); //req,res logging

app.use(express.json()); //json body parser

app.use((req, res, next) => {
  console.log("hello from the middleware 👋");
  next();
}); // custom middleware for simple test

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
}); //logging request time

// ROUTES
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;
