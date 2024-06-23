const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean')
const cookieParser = require('cookie-parser')

dotenv.config({ path: "config.env" });
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");

const dbConnection = require("./config/database");

// Routes
const mountRoutes = require("./routes");
const { weebhookCheckOut } = require("./services/orderService");
const { cookie } = require("express-validator");

//Connect to db
dbConnection();

//Express App
const app = express();

//Cookie
app.use(cookieParser  ())

// Enable other domains to access your application
app.use(cors());
app.options("*", cors());

// compress all responses
app.use(compression());

//checkout weebhook
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  weebhookCheckOut
);
//Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode => ${process.env.NODE_ENV}`);
  
}

//Test time midd
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString;
  console.log(req.cookies)
  next();
})

//
app.use(bodyParser.json({ limit: "20kb" }));
app.use(bodyParser.urlencoded({ extended: true }));


// To remove data using these defaults:
app.use(mongoSanitize());
app.use(xss())
// Limit each ip for 100 req per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: `To many request . please try again after 15 minutes`,
});
app.use("/api", limiter);

//middelle protect against HTTP Parameter Pollution attacks
app.use(hpp({ whitelist: ["price", "sold", "quantity"] }));

//Mount routes
mountRoutes(app);

app.use("*", (req, res, next) => {
  next(new ApiError(`Can't find this EndPoint ${req.originalUrl} `, 400));
});

//Global Error handle middleware
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App running running on port ${PORT}`);
});

//Event => list => cb  function

process.on("unhandledRejection", (err) => {
  console.log(`unhandledRejection Errors: ${err}`);
  server.close(() => {
    console.log("Shutting down ...");
    process.exit(1);
  });
});
