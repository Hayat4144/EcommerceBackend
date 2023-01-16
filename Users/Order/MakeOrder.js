const mongoose = require('mongoose');
const ProductVarient_Model = require('../../Shop/Product/model/Product_Varient');
const AsyncFunc = require('../../utils/AsyncFunc')
const ErrorHandler = require('../../utils/ErrorHandler')
const OrderModal = require('../Model/OrderModal')
const uuid = require('uuid').v4
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

exports.MakeOrder = AsyncFunc(async (req, res, next) => {
    const { products } = req.body;
    console.log(uuid())
    await Promise.all(
        products.map(element => {
            return new Promise((reslove, reject) => {
                ProductVarient_Model.findById(element.varientId, (error, varient) => {
                    if (error) reject(error);
                    if (varient === null) reject("product not found");
                    reslove(varient.toObject())
                });
            })
        })
    ).then((varient) => {
        let productData = [];
        varient.forEach(element => {
            products.forEach(product => {
                if (element._id == product.varientId && !productData.some(data => data._id === element._id)) {
                    productData.push({ ...product, price: element.price })
                }
            });
        });
        const totalPrice = productData.reduce((accum, current) => {
            return accum + (current.price * current.quantity)
        }, 0)
        OrderModal.create({
            user: req.user_id,
            products: productData,
            totalPrice
        }, async (error, doc) => {
            if (error) return next(new ErrorHandler(error, 400));
            await stripe.customers.create({
                email: req.email,
                payment_method: "pm_card_visa"
            }).then(async customer => {
                await stripe.paymentIntents.create({
                    amount: doc.totalPrice * 100, // ------------- stripe take price in cent so, multiply by 100  make it actual payment ---------- //
                    currency: 'INR',
                    payment_method_types: ["card"],
                    customer: customer.id,
                    receipt_email: "ihayat855@gmail.com",
                    confirmation_method: "manual",
                    shipping: {
                        address: {
                            city: "Siwan",
                            line1: "Ismail shaheed road purani quilla pokhra",
                            postal_code: 841210,
                            state: "Bihar",
                            country: "INDIA"
                        },
                        name: "Hayat ilyas"
                    }
                }, {
                    idempotencyKey: uuid(), /// ----------------- avoid payment twice for the same order --------------------- //
                }).then(response => {
                    return res.status(200).json({ data: response.client_secret })
                }).catch(error => {
                    switch (error.type) {
                        case 'StripeCardError':
                            return next(new ErrorHandler(error.message, 400))
                        case 'StripeRateLimitError':
                            return next(new ErrorHandler("Too many requests made to the API too quickly", 400))

                        case 'StripeInvalidRequestError':
                            return next(new ErrorHandler("Invalid parameters were supplied to Stripe's API", 400))
                        case 'StripeAPIError':
                            return next(new ErrorHandler("An error occurred internally with Stripe's API", 400))

                        case 'StripeConnectionError':
                            return next(new ErrorHandler("Some kind of error occurred during the HTTPS communication", 400))
                        case 'StripeAuthenticationError':
                            return next(new ErrorHandler("You probably used an incorrect API key", 400))

                        default:
                            return next(new ErrorHandler(error, 400))
                    }
                })
            }).catch(error => {
                return next(new ErrorHandler(error, 400))
            })

        })
    }).catch(error => {
        console.log(error);
        if (error instanceof mongoose.Error.CastError) return next(new ErrorHandler('Product Not found', 400));
        return next(new ErrorHandler(error, 400))
    });



})


// cus_NAlXDFUY0HPOwP