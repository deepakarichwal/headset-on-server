const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const productRouter = require("./routes/productRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

app.use(cors());

// GLOBAL MIDDLEWARE
app.use(express.json());

app.use((req, res, next) => {
  // console.log(req.headers);
  // console.log(process.env);
  next();
});

// REQUEST LIMITER
const limiter = rateLimit({
  max: 200,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP. Please try again in an hour!",
});

app.use("/api", limiter);

// ROUTES
app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", userRouter);

// HANDLER FOR UNHANDLED ROUTES
app.all("*", (req, res, next) => {
  // res.status(404).json({
  //   status: "fail",
  //   message: `Can't find ${req.originalUrl} on this server`,
  // });

  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.status = "fail";
  // err.statusCode = 404;
  // next(err);
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

module.exports = app;
