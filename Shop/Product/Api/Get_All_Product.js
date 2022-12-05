const Product_Model = require('../model/Product_Model')

exports.Get_All_Product = async(req,res)=>{
    try {
        await Product_Model.find()
        .exec((error,doc)=>{
            return error ? res.status(400).json({error}) : res.status(200).json({doc})
        })
    } catch (error) {
        console.log(error)
    }
}