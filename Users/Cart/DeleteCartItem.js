const AsyncFunc = require("../../utils/AsyncFunc");
const CartItemModel = require("../Model/CartItemModal");

const DeleteCartItem = AsyncFunc(async (req, res, next) => {
  const { cartItemIds } = req.body;
  const deleteitem = async (id) => {
    const dl_item = await CartItemModel.findByIdAndDelete(id);
    return dl_item;
  };

  const deleteItemPromise = Promise.all(
    cartItemIds.map(async (item) => deleteitem(item))
  );
  if ((await deleteItemPromise).some((element) => element === null)) {
    return res.status(400).json({ error: "No Cart has been found" });
  }
  return res.status(200).json({ data: "Cart has been deleted successfully." });
});

module.exports = DeleteCartItem;
