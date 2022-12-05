const express = require('express');
const { Create_Category } = require('../api/Create_Category');
const { Get_Categories } = require('../api/Get_Categories');
const Category_router = express.Router();

Category_router.post('/v4/api/create/category', Create_Category)
Category_router.get('/v4/api/get_all_categories',Get_Categories)

module.exports = Category_router ;