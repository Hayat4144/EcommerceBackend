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
const fs = require("fs");
const http2 = require("http2");
const BannerRouter = require("./Shop/Banner/router/BannerRouter");
const stripe = require("stripe")(process.env.STRIPE_PUBLISHABLE_KEY);

// const app = http2Express(express)
const app = express();


app.use(responsetime());

app.use(cors({
  origin:process.env.NODE_ENV === "production" ? 'https://taj-beta.vercel.app' : 'http://localhost:5173',
  credentials:true
}));

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

app.use(ErrorMiddleware);

app.use(BannerRouter);

app.get("/mom", (req, res) => {
  return res.status(200).cookie("test", "tesing").json({ name: "hello world" });
});

// const options = {
//   key:fs.readFileSync('server.key'),
//   cert:fs.readFileSync('server.crt'),
//   allowHTTP1: true
// }

// const server = http2.createSecureServer(options,app)

//connect database
Database_Connect().then(() => {
  app.listen(process.env.PORT, (err) => {
    err ? console.log(err) : console.log("running at port 5000");
  });
});
