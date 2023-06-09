const mongoose = require("mongoose");
require("mongoose-type-url");

const ProductVarientSchema = new mongoose.Schema(
  {
    productid: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Product",
      required: [true, "Please provide the product id"],
    },
    stock: {
      type: Number,
      min: 10,
      max: 400,
      required: [true, "Please provide the stock of varient"],
    },
    price: {
      type: Number,
      required: [true, "Please provide price of varient"],
      min: 1,
    },
    seller: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "seller",
      required: [true, "Please provide the seller id"],
    },
    attribute: [
      {
        name: {
          type: String,
          required: [true, "attribute name cannot be empty."],
        },
        value: {
          type: String,
          required: [true, "attibute value cannot be empty."],
        },
      },
    ],
  },
  {
    timestamps: {
      createdAt: "created_at", // Use `created_at` to store the created date
      updatedAt: "updated_at", // and `updated_at` to store the last updated date
    },
  }
);

const ProductVarient_Model = new mongoose.model(
  "product_varients",
  ProductVarientSchema
);
module.exports = ProductVarient_Model;
