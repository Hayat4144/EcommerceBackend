const SellerModel = require('../../model/SellerModel')
const bcrypt = require('bcrypt')

exports.SignupSeller = async (req, res) => {
    try {
        const { name, store_name, email, password } = req.body;
        const saltRound = 10;
        const hashpassword = await bcrypt.hash(password, saltRound);
        const create_seller = {
            name, store_name, email, password:hashpassword
        }
        await SellerModel.create(create_seller,(error,doc)=>{
            if(!error){
                return res.status(200).json({"data":`Seller ${doc.email} has been created Successfully.`})
            }
            else{
                if(error.code === 11000){
                    return res.status(400).json({"error":`Sorry, User ${error.keyValue.email} is already exist.`})
                }
                return res.status(400).json({error})
            }
        })
    } catch (error) {
        console.log(error)
    }
}