const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: [true, "Please provide user id."],
    },
    products: [
      {
        ProductId: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        varientId: {
          type: mongoose.Types.ObjectId,
          ref: "product_varients",
        },
        quantity: {
          type: Number,
          required: [true, "please provide quantity"],
        },
        price: {
          type: Number,
          required: [true, "price can not be empty."],
        },
        seller: {
          type: mongoose.SchemaTypes.ObjectId,
          required: [true, "seller can't be empty."],
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: [true, "Total Price can not be empty."],
    },
    status: {
      type: String,
      enum: ["processing", "shipped", "delivered", "cancelled"],
      default: "processing",
    },
    date: {
      type: Date,
      default: Date.now,
    },
    payment_type: {
      type: String,
      enum: ["CARD", "CASHONDELIVERY"],
      required: true,
    },
    payment_intentId: {
      type: String,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const OrderModal = new mongoose.model("OrderModal", OrderSchema);

module.exports = OrderModal;
