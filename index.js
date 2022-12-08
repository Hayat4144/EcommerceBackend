const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const body_pareser = require('body-parser')
const cookie_parser = require('cookie-parser');
const Database_Connect = require('./Config/Database_Config')
const Category_router = require('./Shop/Category/router/Category_Router')
const Product_router = require('./Shop/Product/Router/Product_Router')
const Seller_router = require('./Seller/Router/SellerRouter');
const { ErrorMiddleware } = require('./Middleware/ErrorMiddleware');
const UserRouter = require('./Users/Router/UserRouter');



//connect database 
Database_Connect();


// body_parser
app.use(body_pareser.json())

// cookie-parser 
app.use(cookie_parser())


// category_router 
app.use(Category_router)

// product router
app.use(Product_router)

// seller router
app.use(Seller_router)

// user router 
app.use(UserRouter)

app.use(ErrorMiddleware)


const server = app.listen(5000, (err) => {
	err ? console.log(err) : console.log('running at port 500')
})


// unhandledRejection
// process.on('unhandledRejection', (err) => {
// 	console.log(`Error Message: ${err.message}`)
// 	console.log('Shutting down the server due to uncaughtException ')
// 	process.exit(1)
// })
