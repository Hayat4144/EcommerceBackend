const AsyncFunc = require('../../utils/AsyncFunc')
const ErrorHandler = require('../../utils/ErrorHandler')
const CartItemModel = require('../Model/CartItemModal')
const CartModel = require('../Model/UserCart')


exports.CreateCartItem = AsyncFunc(async (req, res, next) => {
    const { ProductvarientId, quantity, price } = req.body;
    const CartExist = await CartModel.find({ user: req.user_id })
    console.log(CartExist.length);
    if (CartExist.length === 0) {
        console.log('hello')
        CartModel.create({
            user: req.user_id
        }, async (error, data) => {
            if (error) next(new ErrorHandler(error.message, 400))
            console.log(data);
            CartItemModel.create({
                ProductvarientId,
                quantity,
                price,
                cartId: data._id
            }, (error, doc) => {
                if (error) next(new ErrorHandler(error.message, 400))
                return res.status(200).json({ data: doc })
            });

        });

    }
    else {
        console.log(CartExist._id);
        CartItemModel.create({
            ProductvarientId,
            quantity,
            price,
            cartId: CartExist[0]._id
        }, (error, doc) => {
            console.log(doc);
            if (error) return next(new ErrorHandler(error.message, 400))
            return res.status(200).json({ data: doc })
        });
    }
})