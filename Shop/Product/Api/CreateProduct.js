const Product_model = require('../model/Product_Model')
exports.CreateProduct = async(req,res)=>{
    try {
        const {name,description,price,image,category,brand} = req.body ;
        await Product_model.create({
            name,
            description,
            price,
            image,
            category,
            brand
        },(err,doc)=>{
            return !err ? res.status(200).json({doc}) : res.status(400).json({err})
        })
    } catch (error) {
        console.log(error)
    }
}