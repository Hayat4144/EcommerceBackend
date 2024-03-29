const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema({
  CartId: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "cart",
  },
  ProductId: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "Product",
  },
  ProductvarientId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "product_varients",
  },
  quantity: {
    type: Number,
    required: [true, "Please Provide the Quantity"],
    max: [500, "You should have to buy maximum 500"],
    min: [5, "You should have to buy atleast 5"],
  },
  image: {
    url: {
      type: String,
      required: [true, "image url is required."],
    },
    publicId: {
      type: String,
      required: [true, "publicId is required."],
    },
  },
});

const CartItemModel = new mongoose.model("cartItem", CartItemSchema);

module.exports = CartItemModel;
