const mongoose = require('mongoose')
const category_model = require('../../Category/model/category_model')
const ProductSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        max:20
    },
    decription:{
        type:String,
        required:true,
        max:100
    },
    price:{
        type:Number,
        required:true,
    },
    image:{
        type:URL,
        required:true
    },
    catetogry:{
        type: mongoose.SchemaTypes.ObjectId,
        required:true,

    },
    brand:{
        type:String,
        max:50,
        required:true
    }
})

const ProductModel = new mongoose.model('Product', ProductSchema)

module.exports = ProductModel ;