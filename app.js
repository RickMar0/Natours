// require modules
const express = require("express"); // express framework
const morgan = require("morgan"); // middleware logger

//route handlers
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

// error handlers
const AppError = require("./utils/appError");
const globalErrorHandler = require(".//controllers/errorController");

const app = express();

console.log(process.env.NODE_ENV); // log current environment

// 1) MIDDLEWARE
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} // activate morgan logger only in development mode

app.use(express.json()); //json body parser
app.use(express.static(`${__dirname}/public`)); //serving static files

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
}); //logging request time

// ROUTES
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, nxt) => {
  nxt(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
