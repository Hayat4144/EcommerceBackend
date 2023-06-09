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
  const { ProductId, ProductvarientId, quantity, image } = req.body;
  let [CartExist] = await CartModel.find({ user: req.user_id });
  if (CartExist.length < 1) {
    logger.info("conditional");
    CartExist = await CreateUserCart(req.user_id);
  }
  const Isproduct = await IsProductExist(ProductId);
  logger.info('hello products')
  if (!Isproduct)
    return res.status(400).json({ error: "Product does not exist." });

  let existingCartItem;
  if (ProductvarientId) {
    existingCartItem = await CartItemModel.findOne({
      CartId: CartExist._id,
      ProductvarientId: ProductvarientId
    });
  } else {
    existingCartItem = await CartItemModel.findOne({
      CartId: CartExist._id,
      ProductId: Isproduct._id
    });
    logger.info('exist')
  }
  const items = {
    CartId: CartExist._id,
    ProductId: Isproduct._id,
    ProductvarientId: ProductvarientId ? ProductvarientId : null,
    quantity,
    image,
  };

  if(existingCartItem){
    const update_cartItem = await CartItemModel.findByIdAndUpdate(existingCartItem._id,{$set:{...items}},{new:true});
    if(update_cartItem) return res.status(200).json({data:update_cartItem})
  }
  const NewCartItem = await CartItemModel.create(items);
  if (NewCartItem) return res.status(200).json({ data: NewCartItem });
});
