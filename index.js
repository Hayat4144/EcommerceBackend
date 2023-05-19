const express = require("express");
const http2Express = require("http2-express-bridge");
const dotenv = require("dotenv").config();
const body_pareser = require("body-parser");
const cookie_parser = require("cookie-parser");
const Database_Connect = require("./Config/Database_Config");
const Category_router = require("./Shop/Category/router/Category_Router");
const Product_router = require("./Shop/Product/Router/Product_Router");
const Seller_router = require("./Seller/Router/SellerRouter");
const { ErrorMiddleware } = require("./Middleware/ErrorMiddleware");
const UserRouter = require("./Users/Router/UserRouter");
const { CloudinaryConfiguration } = require("./Config/Cloudinary_Config");
const cors = require("cors");
const responsetime = require("response-time");
const BannerRouter = require("./Shop/Banner/router/BannerRouter");
const stripe = require("stripe")(process.env.STRIPE_PUBLISHABLE_KEY);
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");

const app = express();
app.use(responsetime());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? [
            "https://frontend-hayat4144.vercel.app",
            "https://dashboard-hayat4144.vercel.app",
          ]
        : "http://localhost:5173",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// configure clodinay
CloudinaryConfiguration();

// body_parser
app.use(body_pareser.json());

// cookie-parser
app.use(cookie_parser());

// category_router
app.use(Category_router);

// product router
app.use(Product_router);

// seller router
app.use(Seller_router);

// user router
app.use(UserRouter);
app.get("/mom", (req, res) => {
  const { name } = req.query;
  console.log(name);
  return res.status(200).cookie("test", "tesing").json({ name: "hello world" });
});

app.use(BannerRouter);

app.use(ErrorMiddleware);

//connect database
Database_Connect().then(() => {
  app.listen(process.env.PORT, (err) => {
    err ? console.log(err) : console.info("running at port 5000");
  });
});
