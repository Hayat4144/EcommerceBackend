const AsyncFunc = require("../../utils/AsyncFunc");
const CartItemModel = require("../Model/CartItemModal");
const CartModel = require("../Model/UserCart");

const GetCartItem = AsyncFunc(async (req, res, next) => {
  let [CartExist] = await CartModel.find({ user: req.user_id });
  if (CartExist.length < 1)
    return res.status(400).json({ error: "You don't have any cart Item." });
  const CartItems = await CartItemModel.find({
    CartId: CartExist._id,
  });
  if (CartItems.length > 0) return res.status(200).json({ data: CartItems });
  return res.status(400).json({ error: "Cart item does not found." });
});

module.exports = GetCartItem;
