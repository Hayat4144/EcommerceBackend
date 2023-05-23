const AsyncFunc = require("../../utils/AsyncFunc");
const ErrorHandler = require("../../utils/ErrorHandler");
const logger = require("../../utils/Logger");
const CartItemModel = require("../Model/CartItemModal");
const CartModel = require("../Model/UserCart");
const ProductModal = require("../../Shop/Product/model/Product_Model");
const IsProductExist = require("../../utils/IsProductExist");

const CreateUserCart = async (userid) => {
  try {
    const NewUserCart = await CartModel.create({ user: userid });
    if (NewUserCart) return NewUserCart;
  } catch (error) {
    return error;
  }
};

exports.CreateCartItem = AsyncFunc(async (req, res, next) => {
  const { ProductId, ProductvarientId, quantity, price } = req.body;
  let [CartExist] = await CartModel.find({ user: req.user_id });
  if (CartExist.length < 1) {
    logger.info("conditional");
    CartExist = await CreateUserCart(req.user_id);
  }
  const Isproduct = await IsProductExist(ProductId);

  if (!Isproduct)
    return res.status(400).json({ error: "Product does not exist." });

  const items = {
    CartId: CartExist._id,
    ProductId: Isproduct._id,
    ProductvarientId: ProductvarientId ? ProductvarientId : null,
    quantity,
    price: Isproduct.price,
  };

  const NewCartItem = await CartItemModel.create(items);
  if (NewCartItem) return res.json({ data: NewCartItem });
});
