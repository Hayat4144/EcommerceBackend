const AsyncFunc = require("../../utils/AsyncFunc");
const CartItemModel = require("../Model/CartItemModal");

const UpdateCartItem = AsyncFunc(async (req, res, next) => {
  const { cart_item_id, quantity } = req.body;
  const IsCartItem = await CartItemModel.findById(cart_item_id);
  if (!IsCartItem)
    return res.status(400).json({ error: "No cart Item has been found" });
  const UpdatedCartItem = await CartItemModel.findByIdAndUpdate(
    IsCartItem._id,
    { $set: { quantity } },
    { new: true }
  );
  if (UpdatedCartItem)
    return res
      .status(200)
      .json({ data: "Cart has been updated successfully." });
});

module.exports = UpdateCartItem;
