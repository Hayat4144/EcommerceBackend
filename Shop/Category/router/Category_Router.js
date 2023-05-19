const express = require("express");
const { DeleteCategory } = require("../api/DeleteCategory");
const Get_Categories  = require("../api/Get_Categories");
const Category_router = express.Router();
const CreateCategory = require("../api/Create_Category");

//Rest Api

// 1. create category
Category_router.post("/v4/api/create/category", CreateCategory);

// 2 . get category
Category_router.get("/v4/api/get_all_categories", Get_Categories);

// 3 . Delete category
Category_router.delete("/v4/api/delete/category", DeleteCategory);

module.exports = Category_router;
