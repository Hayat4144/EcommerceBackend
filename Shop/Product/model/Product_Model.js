const mongoose = require("mongoose");
const category_model = require("../../Category/model/category_model");
require("mongoose-type-url");
const seller = require("../../../Seller/model/SellerModel");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      max: 20,
    },
    description: {
      type: String,
      required: true,
      max: 100,
    },
    price: {
      type: Number,
      required: true,
    },
    assets: {
      images: {
        type: Array,
        required: true,
      },
    },
    category: {
      type: Array,
      required: true,
    },
    varients: {
      cnt: {
        type: Number,
        max: 40,
        default: 1,
      },
      attributes: [
        {
          name: {
            type: String,
            max: 20,
            min: 2,
          },
        },
      ],
    },
    stock: {
      type: Number,
      required: true,
    },
    brand: {
      type: String,
      max: 50,
      required: true,
    },
    seller: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "seller",
      required: true,
    },
    ratings_review: [
      {
        user: {
          type: mongoose.SchemaTypes.ObjectId,
          // required: true,
          ref: "user",
        },
        Star: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          max: 200,
          min: 30,
        },
      },
    ],
    average_rating: {
      type: Number,
      default: 2,
    },
  },
  {
    timestamps: {
      createdAt: "created_at", // Use `created_at` to store the created date
      updatedAt: "updated_at", // and `updated_at` to store the last updated date
    },
  }
);

// create index
// ProductSchema.index({ name: "text", description: "text", average_rating: 1 })

const ProductModel = new mongoose.model("Product", ProductSchema);

module.exports = ProductModel;
