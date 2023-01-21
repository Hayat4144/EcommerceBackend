const AsyncFunc = require("../../../utils/AsyncFunc");
const ErrorHandler = require("../../../utils/ErrorHandler");
const ProductModel = require("../model/Product_Model");

exports.AllProducts = AsyncFunc(async (req, res, next) => {
    await ProductModel.find({}).then(result=>{
        if(result.length > 0){
            return res.status(200).json({data:result})
        }else{
            return next(new ErrorHandler('No product Found',404))
        }
    }).catch(error=>{
        return next(new(error.message,400))
    })
});
