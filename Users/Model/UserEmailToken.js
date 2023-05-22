const mongoose = require("mongoose");

const UserEmailTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
      required: true,
      unique: true,
    },
    token: {
      type: String,
    },
    expiresAt: {
      type: Date,
      default: function () {
        const currentDate = new Date();
        const futureDate = new Date(currentDate.getTime() + 10 * 60000); // 10 minutes ahead
        return futureDate;
      },
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const UserEmailTokenModel = new mongoose.model(
  "UserEmailToken",
  UserEmailTokenSchema
);

module.exports = UserEmailTokenModel;
