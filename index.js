const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const Database_Connect = require('./Config/Database_Config')
const Category_router = require('./Shop/Category/router/Category_Router')
const Product_router = require('./Shop/Product/Router/Product_Router')

//connect database 
Database_Connect();

// express json parser 
app.use(express.json())

// category_router 
app.use(Category_router)

// product router
app.use(Product_router)

app.listen(5000, (err) => {
	err ? console.log(err) : console.log('running at port 500')
})
