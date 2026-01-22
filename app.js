// require modules
const express = require("express"); // express framework
const morgan = require("morgan"); // middleware logger
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();
console.log(process.env.NODE_ENV);

// 1) MIDDLEWARE
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} // activate morgan logger only in development mode

app.use(express.json()); //json body parser
app.use(express.static(`${__dirname}/public`)); //serving static files

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
